const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");
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
  origins: ["*"],
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
require("./routes/note")(server);

server.listen(config.PORT, err => {
  if (err) throw err;
  console.log(`${server.name} server running on port ${config.PORT}`);
});