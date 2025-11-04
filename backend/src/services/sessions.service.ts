interface SessionMaterial {
  id: string;
  name: string;
  type: 'file' | 'link' | 'text';
  url?: string;
  content?: string;
}

export interface SessionEntity {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  instructor: string;
  instructorId?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  description?: string;
  status: 'live' | 'upcoming' | 'completed';
  participants?: number;
  expectedParticipants?: number;
  engagement?: number;
  type: 'live' | 'scheduled' | 'recorded';
  recordingAvailable?: boolean;
  materials?: SessionMaterial[];
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  createdAt: string;
  updatedAt: string;
}

function statusFrom(date: string, startTime: string, endTime: string): 'live' | 'upcoming' | 'completed' {
  const now = new Date();
  const start = new Date(date);
  const [sh, sm] = startTime.split(':').map(Number);
  start.setHours(sh, sm, 0, 0);
  const end = new Date(date);
  const [eh, em] = endTime.split(':').map(Number);
  end.setHours(eh, em, 0, 0);
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'live';
  return 'completed';
}

export class SessionsService {
  private sessions: Map<string, SessionEntity> = new Map();

  constructor() {
    // Seed a couple of sessions
    const seed: SessionEntity = {
      id: '1',
      title: 'Neural Networks',
      course: 'Machine Learning Fundamentals',
      courseCode: 'CS301',
      instructor: 'Dr. Jane Smith',
      date: '2023-10-15',
      startTime: '14:00',
      endTime: '15:30',
      duration: '90 min',
      status: 'upcoming',
      type: 'scheduled',
      participants: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.sessions.set(seed.id, seed);
  }

  async list(): Promise<SessionEntity[]> {
    return Array.from(this.sessions.values());
  }

  async getById(id: string): Promise<SessionEntity | undefined> {
    return this.sessions.get(id);
  }

  async create(data: Partial<SessionEntity>): Promise<SessionEntity> {
    const id = Date.now().toString();
    const created: SessionEntity = {
      id,
      title: data.title || 'Untitled Session',
      course: data.course || '',
      courseCode: data.courseCode || '',
      instructor: data.instructor || 'Instructor',
      instructorId: data.instructorId,
      date: data.date || new Date().toISOString().slice(0,10),
      startTime: data.startTime || '10:00',
      endTime: data.endTime || '11:00',
      duration: data.duration || '60 min',
      description: data.description || '',
      status: statusFrom(data.date || new Date().toISOString().slice(0,10), data.startTime || '10:00', data.endTime || '11:00'),
      participants: 0,
      expectedParticipants: data.expectedParticipants || 0,
      engagement: 0,
      type: data.type || 'scheduled',
      recordingAvailable: false,
      materials: data.materials || [],
      zoomMeetingId: data.zoomMeetingId,
      zoomJoinUrl: data.zoomJoinUrl,
      zoomStartUrl: data.zoomStartUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.sessions.set(id, created);
    return created;
  }

  async update(id: string, data: Partial<SessionEntity>): Promise<SessionEntity | null> {
    const current = this.sessions.get(id);
    if (!current) return null;
    const updated: SessionEntity = {
      ...current,
      ...data,
      status: statusFrom(data.date || current.date, data.startTime || current.startTime, data.endTime || current.endTime),
      updatedAt: new Date().toISOString(),
    };
    this.sessions.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }

  async join(id: string, userId: string): Promise<boolean> {
    const s = this.sessions.get(id);
    if (!s) return false;
    s.participants = (s.participants || 0) + 1;
    s.updatedAt = new Date().toISOString();
    this.sessions.set(id, s);
    return true;
  }
}


