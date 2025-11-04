const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const zoomApi = {
  async getSignature(meetingNumber: string, role: 0 | 1) {
    const res = await fetch(`${API_BASE_URL}/zoom/signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetingNumber, role }),
    });
    if (!res.ok) throw new Error('Failed to get signature');
    return res.json() as Promise<{ signature: string; sdkKey: string }>; 
  },
};


