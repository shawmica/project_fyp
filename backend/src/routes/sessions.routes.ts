import { Router } from 'express';
import { SessionsController } from '../controllers/sessions.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new SessionsController();

// List sessions
router.get('/', authMiddleware, controller.list.bind(controller));
// Get one
router.get('/:id', authMiddleware, controller.getById.bind(controller));
// Create (instructor/admin)
router.post('/', authMiddleware, controller.create.bind(controller));
// Update
router.put('/:id', authMiddleware, controller.update.bind(controller));
// Delete
router.delete('/:id', authMiddleware, controller.remove.bind(controller));
// Join session
router.post('/:id/join', authMiddleware, controller.join.bind(controller));
// Create/refresh Zoom meeting for a session (instructor/admin)
router.post('/:id/zoom', authMiddleware, controller.createOrRefreshZoom.bind(controller));

export default router;


