CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password_hash TEXT NOT NULL,
                       created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enum para o ciclo de cobrança, garantindo que apenas 'mensal' ou 'anual' sejam aceitos.
CREATE TYPE billing_cycle_enum AS ENUM ('mensal', 'anual');

-- Tabela de Assinaturas
CREATE TABLE subscriptions (
                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               name VARCHAR(100) NOT NULL,
                               category VARCHAR(100),
                               amount NUMERIC(10, 2) NOT NULL,
                               billing_cycle billing_cycle_enum NOT NULL,
                               next_renewal DATE NOT NULL,
                               payment_method VARCHAR(100),
                               created_at TIMESTAMPTZ DEFAULT NOW(),
                               updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cria um índice na coluna user_id para otimizar as buscas de assinaturas por usuário.
CREATE INDEX ON subscriptions (user_id);