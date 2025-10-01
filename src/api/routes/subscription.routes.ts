import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas abaixo requerem autenticação
router.use(authMiddleware);

router.get('/', SubscriptionController.getAll);
router.post('/', SubscriptionController.create);
router.put('/:id', SubscriptionController.update);
router.delete('/:id', SubscriptionController.delete);

export default router;