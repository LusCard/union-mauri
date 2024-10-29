export const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role === role) next();
  else res.status(403).json({ message: "Forbidden: Insufficient role" });
};
