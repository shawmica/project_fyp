import { Router } from 'express';
import { ZoomController } from '../controllers/zoom.controller';

const router = Router();
const controller = new ZoomController();

// Zoom webhooks (set this URL in Zoom marketplace app)
router.post('/webhook', controller.webhook.bind(controller));
router.post('/signature', controller.signature.bind(controller));

export default router;


