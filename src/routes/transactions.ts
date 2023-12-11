import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"

export async function transactionRoutes(server: FastifyInstance) {
  server.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", {
          as: "totalAmount",
        })
        .first()

      return { summary }
    }
  )

  server.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select("*")

      return { transactions }
    }
  )

  server.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const getTransactionSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getTransactionSchema.parse(req.params)

      const transaction = await knex("transactions")
        .where({ id, session_id: sessionId })
        .first()

      return { transaction }
    }
  )

  server.post("/", async (req, reply) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    })

    const { title, amount, type } = createTransactionSchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      })
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
