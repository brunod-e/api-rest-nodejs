import fastify from "fastify"

const server = fastify()

server.get("/hello", async (request, reply) => {
  return { hello: "world" }
})

server
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log(`[Server] Running at http://localhost:3333`)
  })
