const indexController = require("../controllers/index");

module.exports = server => {
  server.get("/", indexController.home);
};
