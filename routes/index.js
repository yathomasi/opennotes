const indexController = require("../controllers/index");
const userRoutes = require("./user");
const noteRoutes = require("./note");

module.exports = server => {
  server.get("/", indexController.home);
  server.get("/api/v1/test", indexController.home);
  userRoutes(server);
  noteRoutes(server);
};
