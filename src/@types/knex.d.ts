// arquivo criado para definição de tipos

import { Knex } from 'knex';

declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string
            title: string
            amount: number
            created_At: string
            session_id?: string //significa que é opcional
        }
    }
}