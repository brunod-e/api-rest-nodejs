import fastify from "fastify"
import { env } from "./env"
import { transactionRoutes } from "./routes/transactions"

const server = fastify()

server.register(transactionRoutes, { prefix: "/transactions" })

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running at http://localhost:3333`)
  })
