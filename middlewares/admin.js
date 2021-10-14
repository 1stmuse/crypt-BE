module.exports = function isAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    const error = new Error("you have no privilege to perform this operation");
    error.status = 401;
    next(error);
    return;
  }

  next();
};
