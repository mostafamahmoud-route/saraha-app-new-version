import { User } from "../db/models/user.model.js";
import { decodeToken } from "../utils/security/token/token.js";

export const isAuthenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }

    const token = authorization.split(" ")[1];
    const payload = decodeToken({ token });

    const user = await User.findById(payload._id).select("-password");

    if (!user) {
      const error = new Error("Invalid token");
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    return next();
  } catch (err) {
    err.statusCode = err.statusCode || 401;
    err.message = err.message || "Unauthorized";
    return next(err);
  }
};
