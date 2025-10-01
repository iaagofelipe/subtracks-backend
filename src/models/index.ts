export interface User {
    id: string; // uuid
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
}

export type BillingCycle = 'mensal' | 'anual';

export interface Subscription {
    id: string; // uuid
    user_id: string; // uuid
    name: string;
    category?: string;
    amount: number;
    billing_cycle: BillingCycle;
    next_renewal: Date;
    payment_method?: string;
    created_at: Date;
    updated_at: Date;
}