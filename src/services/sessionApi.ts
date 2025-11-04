const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface SessionDto {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  instructor: string;
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
  materials?: Array<{ id: string; name: string; type: 'file' | 'link' | 'text'; url?: string; content?: string; }>
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSessionPayload {
  title: string;
  course: string;
  courseCode: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string | number;
  description?: string;
  materials?: SessionDto['materials'];
  expectedParticipants?: number;
  type: SessionDto['type'];
  createZoom?: boolean;
}

export const sessionApi = {
  async list(): Promise<SessionDto[]> {
    const res = await fetch(`${API_BASE_URL}/sessions`);
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  },
  async get(id: string): Promise<SessionDto> {
    const res = await fetch(`${API_BASE_URL}/sessions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch session');
    return res.json();
  },
  async create(payload: CreateSessionPayload, opts?: { role?: 'student' | 'instructor' | 'admin' }): Promise<SessionDto> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (opts?.role) {
      // Dev auth: send role so backend mock middleware authorizes instructor/admin
      headers['Authorization'] = 'Bearer dev';
      headers['X-User-Role'] = opts.role;
    }
    const res = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
  },
  async update(id: string, payload: Partial<CreateSessionPayload>): Promise<SessionDto> {
    const res = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update session');
    return res.json();
  },
  async createZoom(id: string): Promise<SessionDto> {
    const res = await fetch(`${API_BASE_URL}/sessions/${id}/zoom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev',
        'X-User-Role': 'instructor',
      },
    });
    if (!res.ok) throw new Error('Failed to create Zoom meeting');
    return res.json();
  },
};


