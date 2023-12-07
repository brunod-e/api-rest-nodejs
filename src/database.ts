import { knex as setupKnex, Knex } from "knex"

export const knexConfig: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
}

export const knex = setupKnex(knexConfig)
