function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const CheckBody = (req, res, next) => {
  const { email } = req.body;

  if (email) {
    if (validateEmail(email)) {
      next();
    } else {
      const error = new Error("email is not valid");
      error.status = 401;
      next(error);
    }
  }
  next();
};
