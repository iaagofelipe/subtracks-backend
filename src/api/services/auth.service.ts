import db from '../../config/db';
import {User} from '../../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Adicione uma variável de ambiente para o segredo do JWT no seu .env
// JWT_SECRET=seu-segredo-super-secreto
const jwtSecret = process.env.JWT_SECRET || 'default_secret';

export const AuthService = {
    /**
     * Registra um novo usuário no banco de dados.
     */
    async register(name: string, email: string, password: string): Promise<Omit<User, 'password_hash'>> {
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            throw new Error('Este email já está em uso.');
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insere o novo usuário no banco
        const newUserResult = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
            [name, email, password_hash]
        );

        return newUserResult.rows[0];
    },

    /**
     * Autentica um usuário e retorna um token JWT.
     */
    async login(email: string, password: string): Promise<{ token: string }> {
        // Encontra o usuário pelo email
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user: User = userResult.rows[0];

        if (!user) {
            throw new Error('Credenciais inválidas.'); // Erro genérico por segurança
        }

        // Compara a senha enviada com o hash armazenado
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Credenciais inválidas.');
        }

        // Gera o token JWT
        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(payload, jwtSecret, {expiresIn: '7d'}); // Token expira em 7 dias

        return {token};
    },
};