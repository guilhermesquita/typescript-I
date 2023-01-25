import { knex } from 'knex'

export const db = knex({
    client:'sqlite',
    connection: {
        filename: './src/database/labecommerce.db',
    },
    useNullAsDefault: true, //UNDEFINED SERÁ ARMAZENADO COMO NULL
    pool:{
        min: 0,
        max: 1
    }//nº de conexões
})