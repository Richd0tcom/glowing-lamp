import { Model, mixin,compose } from 'objection';
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

const mixins = compose(visibility, DBErrors, modelUuid)

// export class baseModel extends mixins(Model) {
//   static query(...args: any) {
//     return super.query(...args).throwIfNotFound();
//   }

  
// }

export default mixins;

// export type Db<PropertyType extends object = object> = Model & PropertyType;
// export const Db: typeof Model & (new <PropertyType extends object = object>() => Db<PropertyType>) = Model as any; // type cast here because it'll complain otherwise

