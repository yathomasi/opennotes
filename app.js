const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const config = require("./config/config");
const passport = require("passport");

const server = restify.createServer({
  name: config.NAME,
  url: config.URL
});
//cors
const cors = corsMiddleware({
  origins: ["*"], //TODO change to domain
  allowHeaders: ["Authorization"],
  exposeHeaders: ["Authorization"]
});

if (config.NODE_ENV == "development") {
  server.use(logger("dev"));
  console.log("Logger on development mode");
} else if (config.NODE_ENV == "production") {
  console.log("Production mode");
  server.use(compression());
  server.use(helmet());
}
//default
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);
//passport
server.use(passport.initialize());

//Routes
require("./db/models");
require("./routes")(server);

// Default error handler
server.use(function(err, req, res, next) {
  res.status(400).json(err);
});

server.listen(config.PORT, err => {
  if (err) throw err;
  console.log(`${server.name} server running on port ${config.PORT}`);
});
