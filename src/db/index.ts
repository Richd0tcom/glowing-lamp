import Knex from 'knex'
import config from './knexfile'

/**
 * Creates a KnexJS instance 
 */
export const KnexInstance = Knex(config[process.env.NODE_ENV!])