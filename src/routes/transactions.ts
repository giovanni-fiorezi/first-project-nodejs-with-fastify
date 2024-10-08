import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import crypto, { randomUUID } from 'node:crypto';

export async function transactionsRoutes(app: FastifyInstance) {

    app.get('/', async () => {
        const transactions = await knex('transactions').select();
        return { transactions };
    });

    app.get('/:id', async(request) => {
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getTransactionParamsSchema.parse(request.params);

        const transaction = await knex('transactions').select('id', id).first();
        return { transaction };
    });

    app.get('/summary', async() => {
        const transaction = await knex('transactions')
        .sum('amount', { as: 'amount' })  // colocar o nome da coluna na função
        .first();

        return { transaction };
    })

    app.post('/', async (request, response) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        });

        const { title, amount, type } = createTransactionBodySchema.parse(request.body);

        let sessionId = request.cookies.sessionId;

        if(!sessionId) {
            sessionId = randomUUID();

            response.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
        }

        await knex('transactions')
        .insert({
            id: crypto.randomUUID(),
            title,
            amount: type == 'credit' ? amount : amount * -1,
            session_id: sessionId,
        })

        return response.status(201).send();
    });
}
