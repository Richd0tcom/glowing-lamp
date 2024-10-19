import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return await knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary().notNullable();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.string('txn_pin').notNullable();
      table.timestamps(true, true);
    })
    .createTable('transactions', (table) => {
      table.uuid('id').primary().notNullable();
      table
        .uuid('from_account_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table
        .uuid('to_account_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table.string('amount').notNullable();
      table.string('description');
      table.timestamps(true, true);
    })
    .createTable('entries', (table) => {
      table.uuid('id').primary().notNullable();
      table
        .uuid('account_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table.enum('tx_type', ['debit, credit']).notNullable();

      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE "users" CASCADE');
  await knex.raw('DROP TABLE "transactions" CASCADE');
  return await knex.raw('DROP TABLE "entries" CASCADE');
}
