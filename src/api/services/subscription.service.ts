import db from '../../config/db';
import { Subscription } from '../../models';

type CreateSubscriptionDto = Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const SubscriptionService = {
    async getAllByUserId(userId: string): Promise<Subscription[]> {
        const res = await db.query('SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY next_renewal ASC', [userId]);
        return res.rows;
    },

    async create(userId: string, data: CreateSubscriptionDto): Promise<Subscription> {
        const { name, category, amount, billing_cycle, next_renewal, payment_method } = data;
        const res = await db.query(
            `INSERT INTO subscriptions (user_id, name, category, amount, billing_cycle, next_renewal, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [userId, name, category, amount, billing_cycle, next_renewal, payment_method]
        );
        return res.rows[0];
    },

    async update(subscriptionId: string, userId: string, data: Partial<CreateSubscriptionDto>): Promise<Subscription | null> {
        const { name, category, amount, billing_cycle, next_renewal, payment_method } = data;
        const res = await db.query(
            `UPDATE subscriptions
           SET name = $1, category = $2, amount = $3, billing_cycle = $4, next_renewal = $5, payment_method = $6, updated_at = NOW()
           WHERE id = $7 AND user_id = $8
           RETURNING *`,
            [name, category, amount, billing_cycle, next_renewal, payment_method, subscriptionId, userId]
        );
        return res.rows[0] || null;
    },

    async delete(subscriptionId: string, userId: string): Promise<boolean> {
        const res = await db.query('DELETE FROM subscriptions WHERE id = $1 AND user_id = $2', [subscriptionId, userId]);
        return (res.rowCount ?? 0) > 0;
    }
};