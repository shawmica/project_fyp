import { Request, Response } from 'express';
import { ZoomService } from '../services/zoom.service';
import { SessionsService } from '../services/sessions.service';

export class ZoomController {
  private zoom = new ZoomService();
  private sessions = new SessionsService();

  // Webhook endpoint
  async webhook(req: Request, res: Response) {
    const event = (req.body && req.body.event) || 'unknown';
    try {
      // Handle Zoom URL validation flow
      if (event === 'endpoint.url_validation') {
        const plainToken = req.body?.payload?.plainToken;
        const secret = process.env.ZOOM_WEBHOOK_SECRET || '';
        if (!plainToken || !secret) {
          return res.status(400).json({ error: 'Missing plainToken or secret' });
        }
        const crypto = await import('crypto');
        const hashForValidate = crypto
          .createHmac('sha256', secret)
          .update(plainToken)
          .digest('base64');
        return res.status(200).json({ plainToken, encryptedToken: hashForValidate });
      }
      // For all other events, verify signature/token
      if (!this.zoom.verifyWebhook(req)) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
      switch (event) {
        case 'meeting.started': {
          const meetingId = req.body.payload?.object?.id;
          // Optionally map meetingId -> session and mark live
          // (requires mapping to be stored on creation)
          break;
        }
        case 'meeting.ended': {
          const meetingId = req.body.payload?.object?.id;
          // Optionally mark session completed
          break;
        }
        default:
          break;
      }
      res.json({ received: true });
    } catch (e: any) {
      console.error('Zoom webhook error:', e);
      res.status(500).json({ error: 'handler error' });
    }
  }

  // Generate a Meeting SDK signature for embedding
  async signature(req: Request, res: Response) {
    try {
      const { meetingNumber, role } = req.body || {};
      if (!meetingNumber) return res.status(400).json({ error: 'meetingNumber required' });
      const sig = this.zoom.generateSdkSignature(String(meetingNumber), role === 1 ? 1 : 0);
      res.json({ signature: sig, sdkKey: process.env.ZOOM_SDK_KEY });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'signature error' });
    }
  }
}


