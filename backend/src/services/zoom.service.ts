import crypto from 'crypto';

interface CreateMeetingPayload {
  topic: string;
  start_time: string; // ISO8601
  duration: number; // minutes
  timezone?: string;
}

export class ZoomService {
  private accountId = process.env.ZOOM_ACCOUNT_ID || '';
  private clientId = process.env.ZOOM_CLIENT_ID || '';
  private clientSecret = process.env.ZOOM_CLIENT_SECRET || '';
  private apiBase = 'https://api.zoom.us/v2';
  private sdkKey = process.env.ZOOM_SDK_KEY || '';
  private sdkSecret = process.env.ZOOM_SDK_SECRET || '';

  async getAccessToken(): Promise<string> {
    if (!this.accountId || !this.clientId || !this.clientSecret) {
      throw new Error('Zoom S2S OAuth credentials not configured');
    }
    const basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.accountId}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Zoom token error ${res.status}: ${text}`);
    }
    const json = await res.json() as { access_token: string };
    return json.access_token;
  }

  async createMeeting(payload: CreateMeetingPayload): Promise<{ id: string; join_url: string; start_url: string; }> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.apiBase}/users/me/meetings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: payload.topic,
        type: 2,
        start_time: payload.start_time,
        duration: payload.duration,
        timezone: payload.timezone || 'UTC',
        settings: {
          join_before_host: true,
          approval_type: 0,
          waiting_room: false,
        },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Zoom create meeting error ${res.status}: ${text}`);
    }
    const data = await res.json();
    return { id: String(data.id), join_url: data.join_url, start_url: data.start_url };
  }

  // Basic webhook verification for development (token match)
  verifyWebhook(req: any): boolean {
    const secret = process.env.ZOOM_WEBHOOK_SECRET;
    if (!secret) return true; // allow in dev if not set
    const headerToken = req.headers['x-zoom-webhook-token'] as string | undefined;
    return !!headerToken && headerToken === secret;
  }

  // Generate Meeting SDK signature
  // role: 0 participant, 1 host
  generateSdkSignature(meetingNumber: string, role: 0 | 1) {
    if (!this.sdkKey || !this.sdkSecret) {
      throw new Error('Zoom SDK credentials not configured');
    }
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2; // 2 hours
    const oHeader = { alg: 'HS256', typ: 'JWT' } as any;
    const oPayload = {
      appKey: this.sdkKey,
      sdkKey: this.sdkKey,
      mn: meetingNumber,
      role,
      iat,
      exp,
      tokenExp: exp,
    } as any;
    function base64url(source: Buffer) {
      return source.toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
    const sHeader = base64url(Buffer.from(JSON.stringify(oHeader)));
    const sPayload = base64url(Buffer.from(JSON.stringify(oPayload)));
    const signature = crypto
      .createHmac('sha256', this.sdkSecret)
      .update(`${sHeader}.${sPayload}`)
      .digest('base64')
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return `${sHeader}.${sPayload}.${signature}`;
  }
}


