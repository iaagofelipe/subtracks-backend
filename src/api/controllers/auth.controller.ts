import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const AuthController = {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            const user = await AuthService.register(name, email, password);
            res.status(201).json({ message: 'Usuário criado com sucesso!', user });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
            }

            const { token } = await AuthService.login(email, password);
            res.status(200).json({ token });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
};