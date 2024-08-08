import { knex as setupKnex, Knex } from 'knex';
import { env } from './env';

if(process.env.DATABASE_URL == null) {
    throw new Error('DATABASE_URL IS NULL');
}

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: 'C:/Desenvolvimento_Projetos/node-js/api-rest-nodejs-fastfy/db/migrations',
    }
};

export const knex = setupKnex(config);