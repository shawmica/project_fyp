import { Request, Response } from 'express';
import { SessionsService } from '../services/sessions.service';
import { ZoomService } from '../services/zoom.service';

export class SessionsController {
  private service: SessionsService;
  private zoom: ZoomService;
  constructor() {
    this.service = new SessionsService();
    this.zoom = new ZoomService();
  }

  async list(req: Request, res: Response) {
    const sessions = await this.service.list();
    res.json(sessions);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const session = await this.service.getById(id);
    if (!session) return res.status(404).json({ error: 'Not found' });
    res.json(session);
  }

  async create(req: Request, res: Response) {
    const user = (req as any).user;
    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { title, date, startTime, endTime, duration, course, courseCode, description, materials, expectedParticipants, type } = req.body || {};
    // Default to creating Zoom when not specified
    const createZoom = (req.body && typeof req.body.createZoom !== 'undefined') ? !!req.body.createZoom : true;

    let zoomFields: { zoomMeetingId?: string; zoomJoinUrl?: string; zoomStartUrl?: string } = {};
    if (createZoom) {
      try {
        // Build ISO start time (UTC) with fallback if in the past
        const proposed = new Date(`${date}T${startTime}:00Z`);
        const nowPlus2 = new Date(Date.now() + 2 * 60 * 1000);
        const effectiveStart = isNaN(proposed.getTime()) || proposed < nowPlus2 ? nowPlus2 : proposed;
        const startIso = effectiveStart.toISOString();
        const minutes = typeof duration === 'string' && duration.includes('min')
          ? parseInt(duration)
          : (typeof duration === 'number' ? duration : 60);
        const meeting = await this.zoom.createMeeting({
          topic: title || 'Session',
          start_time: startIso,
          duration: minutes,
          timezone: 'UTC',
        });
        zoomFields = {
          zoomMeetingId: meeting.id,
          zoomJoinUrl: meeting.join_url,
          zoomStartUrl: meeting.start_url,
        };
      } catch (e: any) {
        console.error('Zoom meeting create failed:', e?.message || e);
        // Continue without Zoom
      }
    }

    const created = await this.service.create({
      title,
      date,
      startTime,
      endTime,
      duration,
      course,
      courseCode,
      description,
      materials,
      expectedParticipants,
      type,
      instructor: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Instructor',
      instructorId: user.id,
      ...zoomFields,
    });
    res.status(201).json(created);
  }

  async update(req: Request, res: Response) {
    const user = (req as any).user;
    const { id } = req.params;
    const updated = await this.service.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;
    const ok = await this.service.remove(id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  }

  async join(req: Request, res: Response) {
    const { id } = req.params;
    const user = (req as any).user;
    const ok = await this.service.join(id, user?.id || 'user');
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  }

  async createOrRefreshZoom(req: Request, res: Response) {
    const user = (req as any).user;
    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { id } = req.params;
    const session = await this.service.getById(id);
    if (!session) return res.status(404).json({ error: 'Not found' });
    try {
      const proposed = new Date(`${session.date}T${session.startTime}:00Z`);
      const nowPlus2 = new Date(Date.now() + 2 * 60 * 1000);
      const effectiveStart = isNaN(proposed.getTime()) || proposed < nowPlus2 ? nowPlus2 : proposed;
      const startIso = effectiveStart.toISOString();
      const minutes = typeof session.duration === 'string' && session.duration.includes('min')
        ? parseInt(session.duration)
        : (typeof (session as any).duration === 'number' ? (session as any).duration : 60);
      const meeting = await this.zoom.createMeeting({
        topic: session.title,
        start_time: startIso,
        duration: minutes,
        timezone: 'UTC',
      });
      const updated = await this.service.update(id, {
        zoomMeetingId: meeting.id,
        zoomJoinUrl: meeting.join_url,
        zoomStartUrl: meeting.start_url,
      });
      res.json(updated);
    } catch (e: any) {
      console.error('Zoom meeting refresh failed:', e?.message || e);
      res.status(500).json({ error: 'Zoom create failed' });
    }
  }
}


