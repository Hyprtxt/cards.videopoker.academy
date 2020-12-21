const Hapi = require("@hapi/hapi")
const Joi = require("joi")
const Deck = require("@hyprtxt/deck").default
const Poker = require("@hyprtxt/poker").default

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
    method: "PUT",
    path: "/",
    options: {
      validate: {
        payload: Joi.array()
          .unique()
          .length(5)
          .items(
            Joi.string()
              .length(2)
              .custom((value, helpers) => {
                // console.log("isCard", value, Deck.isCard(value))
                if (!Deck.isCard(value)) {
                  return helpers.error("any.invalid")
                }
                return value
              }, "custom validation - Deck.isCard")
          ),
      },
    },
    handler: (request, h) => {
      const payload = request.payload
      let reply = { ...Poker.score(payload), hand: payload }
      return reply
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
