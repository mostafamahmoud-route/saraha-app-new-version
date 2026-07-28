import jwt from "jsonwebtoken";

export const generateToken = ({
  payload,
  signature = process.env.ACCESS_USER_TOKEN_SIGNATURE,
  options = {},
} = {}) => {
  return jwt.sign(payload, signature, options);
};

export const decodeToken = ({
  token,
  signature = process.env.ACCESS_USER_TOKEN_SIGNATURE,
} = {}) => {
  return jwt.verify(token, signature);
};

export const authToken = async ({ token, signature, next } = {}) => {
  const tokeData = decodeToken({
    token,
    signature,
  });

  const user = await DBService.findOne({
    model: userModel,
    filter: { _id: tokeData._id },
  });

  if (!user) {
    return next(new Error("user not found, signup", { cause: 404 }));
  }

  return user;
};
