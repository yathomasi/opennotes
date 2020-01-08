const config = require("../config/config");
const redisClient = require("../config/redisClient");
const jwt = require("jsonwebtoken");

let jwtOptions = {};
jwtOptions.issuer = config.JWT_ISSUER;
jwtOptions.expiresIn = config.JWT_EXP;

function rmExp(token) {
  try {
    const { exp } = jwt.decode(token, config.JWT_SECRET, jwtOptions);
    if (Date.now() >= exp * 1000) {
      return true;
    } else return false;
  } catch (err) {
    console.error(err);
  }
}
function rmTkn(tkn) {
  redisClient.lrem("token", 0, tkn, (err, result) => {
    if (err) console.error(err);
    console.log(result);
    console.log("deleted");
  });
}
redisClient.lrange("token", 0, -1, (err, result) => {
  if (err) console.error(err);
  //check token is expired or not
  let data = result.map(rmExp);
  console.log(data);
  //filter the expired token
  let fil = result.filter((d, i) => data[i]);
  console.log(fil);
  //remove the expired tokens
  fil.map(rmTkn);
  setTimeout(() => {
    process.exit();
  }, 5000);
});
