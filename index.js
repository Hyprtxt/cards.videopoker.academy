const Hapi = require("@hapi/hapi")
const Deck = require("@hyprtxt/deck").default

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  })
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return Deck.getNewCards()
    },
  })
  server.route({
    method: "GET",
    path: "/poker",
    handler: (request, h) => {
      return Deck.getNewCards()
    },
  })
  await server.start()
  console.log("Server running on %s", server.info.uri)
}

process.on("unhandledRejection", err => {
  console.log(err)
  process.exit(1)
})

init()
