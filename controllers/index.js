exports.home = (req, res, next) => {
  res.json({ msg: "Its running" });
  next();
};
