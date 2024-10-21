import { Knex } from "knex"; 
import ids from "../seed-ids";
import { hashPassword } from "../../common/helpers/password";

export async function seed(knex: Knex): Promise<void> {
    // // Deletes ALL existing entries
    // await knex("users").del();

    // Inserts seed entries
    await knex("users").insert(
        ids.users.map((user: string, index: number)=>{
            console.log(user)
            return {
                id: user,
                username: `user-${String(index)}`,
                password: hashPassword('123')
            }
        })
    );

    await knex('entries').insert(
        ids.entries.map((entry: string, index: number)=>{
            return {
                id: entry,
                userId: ids.users[index],
                amount: index == 0 ? "5000": "999999",
                txType: index == 0 ? 'credit' : 'debit'
            }
        })
    )
};
