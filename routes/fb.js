const fbController = require("../controllers/fb");
const auth = require("../middleware/auth");

module.exports = server => {
  server.get("/auth/facebook", auth.authFB);
  server.get("/auth/facebook/callback", auth.authFB, fbController.fbAuth);
  server.get("/auth/logout", (req, res, next) => {
    req.logout();
    res.redirect("/api/v1/test", next);
  });
};
