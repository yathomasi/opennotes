exports.fbAuth = (req, res, next) => {
  if (req.user.id) {
    res.send({
      facebookid: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
    next();
  }
};
