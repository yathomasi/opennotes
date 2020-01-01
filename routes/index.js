const indexController = require("../controllers/index");

module.exports = server => {
  server.get("/api/v1/test", indexController.home);
};
