const Hapi = require("@hapi/hapi")
const Joi = require("@hapi/joi")
let Deck = require("@hyprtxt/deck").default
const Poker = require("@hyprtxt/poker")

Deck.isCard = maybe_card => {
  // console.log(typeof maybe_card, maybe_card.length)
  if (typeof maybe_card !== "string") {
    return false
  }
  if (maybe_card.length !== 2) {
    return false
  }
  const [suit, value] = maybe_card.split("")
  // console.log(suit, value, Deck.suits.indexOf(suit), Deck.values.indexOf(value))
  if (Deck.suits.indexOf(suit) === -1) {
    return false
  }
  if (Deck.values.indexOf(value) === -1) {
    return false
  }
  return true
}

const isCardJoi = (value, helpers) => {
  if (!Deck.isCard(value)) {
    return helpers.error("any.invalid")
  }
  return value
}

console.log(Deck, Poker)

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
          .items(Joi.string().length(2).custom(isCardJoi, "is card")),
      },
    },
    handler: (request, h) => {
      const payload = request.payload
      let reply = { ...Poker.Score(payload), hand: payload }
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
