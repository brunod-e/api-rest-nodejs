import { FastifyInstance } from "fastify"
import { knex } from "../database"

export async function transactionRoutes(server: FastifyInstance) {
  server.get("/transactions", async (req, reply) => {
    const transactions = await knex("transactions")
      .where("amount", 1000)
      .select("*")

    return transactions
  })
}
