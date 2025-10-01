import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import db from './config/db';
import authRoutes from './api/routes/auth.routes';
import subscriptionRoutes from './api/routes/subscription.routes';

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de teste com async/await
app.get('/api', async (req: Request, res: Response) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({
            message: 'API do SubTrack está no ar!',
            db_time: result.rows[0].now,
        });
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        res.status(500).json({ error: 'Erro ao conectar ao banco de dados.' });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});