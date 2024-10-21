import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return await knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary().notNullable();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.timestamps(true, true, true);
    })
    .createTable('references', (table) => {
      table.uuid('id').primary().notNullable();
      // table
      //   .uuid('transactionId')
      //   .references('id')
      //   .inTable('transfers')
      //   .onDelete('CASCADE')
      table.timestamps(true, true, true);
    })
    .createTable('transfers', (table) => {
      table.uuid('id').primary().notNullable();
      table
        .uuid('fromUserId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table
        .uuid('toUserId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table
        .uuid('transactionReference')
        .references('id')
        .inTable('references')
        .onDelete('CASCADE')
        .notNullable();
      table.double('amount').notNullable();
      table.string('description');
      table.timestamps(true, true, true);
    })
    .alterTable('references', (table) => {
      table
        .uuid('transactionId')
        .references('id')
        .inTable('transfers')
        .onDelete('CASCADE');
    })
    .createTable('entries', (table) => {
      table.uuid('id').primary().notNullable();
      table.double('amount').notNullable();
      table
        .uuid('userId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table.enum('txType', ['debit', 'credit']).notNullable();

      table.timestamps(true, true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE "users" CASCADE');
  await knex.raw('DROP TABLE "references" CASCADE');
  await knex.raw('DROP TABLE "transfers" CASCADE');
  return await knex.raw('DROP TABLE "entries" CASCADE');
}
