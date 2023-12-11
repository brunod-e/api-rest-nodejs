import fastify from "fastify"
import { knex } from "./database"
import crypto from "node:crypto"
import { env } from "./env"

const server = fastify()

server.get("/transactions", async (req, reply) => {
  const transactions = await knex("transactions")
    // .where("amount", 1000)
    .select("*")

  return transactions
})

server.post("/transactions", async (req, reply) => {
  const transaction = await knex("transactions")
    .insert({
      id: crypto.randomUUID(),
      title: "Test transaction",
      amount: 100,
    })
    .returning("*")

  return transaction
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running at http://localhost:3333`)
  })
