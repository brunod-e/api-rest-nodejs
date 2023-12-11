import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"

export async function transactionRoutes(server: FastifyInstance) {
  server.get("/", async () => {
    const transactions = await knex("transactions").select("*")

    return { transactions }
  })

  server.get("/:id", async (req) => {
    const getTransactionSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getTransactionSchema.parse(req.params)

    const transaction = await knex("transactions").where({ id }).first()

    return { transaction }
  })

  server.post("/", async (req, reply) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    })

    const { title, amount, type } = createTransactionSchema.parse(req.body)

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
}
