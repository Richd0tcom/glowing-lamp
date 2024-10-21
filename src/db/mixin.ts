import { Model,compose } from 'objection';
import { KnexInstance } from './index';
// import * as guid from 'objection-guid';
const guid = require('objection-guid');
import visibility from 'objection-visibility';
import { DBErrors } from 'objection-db-errors';

//@ts-ignore
import objection_unique = require('objection-unique');

Model.knex(KnexInstance);

const modelUuid = guid();

export const modelUnique = objection_unique({
  fields: ['username'],
  identifiers: ['id'],
});

/**
 * mixin plugin for UUID, Database errors and field visibility
 */
const mixins = compose(visibility, DBErrors, modelUuid)


export default mixins;

