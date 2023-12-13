import { it, beforeAll, afterAll, describe } from "vitest"
import { app } from "../src/app"
import request from "supertest"

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "Test transaction",
        amount: 9999,
        type: "credit",
      })
      .expect(201)
  })
})
