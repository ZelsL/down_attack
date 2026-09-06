export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res
    .status(401)
    .json({ error: "You must be authenticated to access this resource." });
}

export function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return next();
  } else {
    return res
      .status(403)
      .json({ error: "You must be an admin to access this resource." });
  }
}
