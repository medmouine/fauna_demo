const fauna = require("faunadb");

// Test DB
const fclient = new fauna.Client({
  secret: "SECRET",
});

fclient.ping().then(console.log);

module.exports = fclient;
