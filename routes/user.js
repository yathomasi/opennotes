const userController = require("../controllers/user");
const {
  loginValidation,
  registerValidation,
  validate
} = require("../middleware/validator");
const auth = require("../middleware/auth");

module.exports = server => {
  server.get("/api/v1/me", auth.validJWT, userController.getMe);
  server.get("/api/v1/users", auth.validJWT, userController.listUsers);
  server.get("/api/v1/users/:id", auth.validJWT, userController.getUser);
  server.post(
    "/api/v1/register",
    registerValidation(),
    validate,
    userController.registerUser
  );
  server.post(
    "/api/v1/login",
    loginValidation(),
    validate,
    userController.loginUser
  );
  server.get("/api/v1/logout", auth.validJWT, userController.logout);
};
