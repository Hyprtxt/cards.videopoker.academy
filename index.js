const Hapi = require("@hapi/hapi")
let Deck = require("@hyprtxt/deck").default
const Poker = require("@hyprtxt/poker").default

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

console.log(Deck)

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
    handler: (request, h) => {
      const payload = request.payload
      let reply
      if (typeof payload.map === "function") {
        reply = payload.filter(card => {
          console.log(Deck.isCard(card))
          return Deck.isCard(card)
        })
      }
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
