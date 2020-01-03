const userController = require("../controllers/user");
const {
  loginValidation,
  registerValidation,
  validate
} = require("../middleware/validator");

module.exports = server => {
  server.get("/api/v1/users", userController.listUsers);
  server.get("/api/v1/users/:id", userController.getUser);
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
};
