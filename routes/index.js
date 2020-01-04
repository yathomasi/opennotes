const indexController = require("../controllers/index");
const userRoutes = require("./user");
const noteRoutes = require("./note");
const fbRoutes = require("./fb");

module.exports = server => {
  server.get("/api/v1/test", indexController.home);
  userRoutes(server);
  noteRoutes(server);
  fbRoutes(server);
};
