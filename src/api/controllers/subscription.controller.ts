import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { SubscriptionService } from '../services/subscription.service';

export const SubscriptionController = {
    async getAll(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const subscriptions = await SubscriptionService.getAllByUserId(userId);
            res.status(200).json(subscriptions);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar assinaturas.' });
        }
    },

    async create(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const newSubscription = await SubscriptionService.create(userId, req.body);
            res.status(201).json(newSubscription);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async update(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            const updatedSubscription = await SubscriptionService.update(id, userId, req.body);

            if (!updatedSubscription) {
                return res.status(404).json({ message: 'Assinatura não encontrada ou não pertence ao usuário.' });
            }
            res.status(200).json(updatedSubscription);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async delete(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            const success = await SubscriptionService.delete(id, userId);

            if (!success) {
                return res.status(404).json({ message: 'Assinatura não encontrada ou não pertence ao usuário.' });
            }
            res.status(204).send(); // 204 No Content
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao deletar assinatura.' });
        }
    },
};