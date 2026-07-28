import { User } from "../../db/models/user.model.js";
import { ProviderEnum } from "../../utils/enums/user.enum.js";
import {
  BadRequestException,
  ConflictException,
} from "../../utils/response/error.response.js";
import { successResponse } from "../../utils/response/success.response.js";
import { encrypt } from "../../utils/security/encryption/encrypt.js";
import { compare } from "../../utils/security/hashing/compare.js";
import { hash } from "../../utils/security/hashing/hash.js";
import { generateToken } from "../../utils/security/token/token.js";
import { OAuth2Client } from "google-auth-library";

const createAccessToken = (user) => {
  return generateToken({
    payload: { _id: user._id },
  });
};

export const signUp = async (req, res, next) => {
  const { firstName, lastName, username, email, password, gender, phone } =
    req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return ConflictException("User Already Exists");
  }

  const userCreated = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    gender,
    phone: encrypt(phone),
  });

  return successResponse({
    res,
    message: "User Created Successfully",
    data: userCreated,
  });
};

export const login = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return BadRequestException("Invalid password or email");
  }

  return successResponse({
    res,
    message: "User Login Successfully",
    data: {
      access_token: createAccessToken(user),
    },
  });
};

export const signinWithGoogle = async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  let userExist = await User.findOne({ email: payload.email }); // undefined

  if (!userExist) {
    userExist = await User.create({
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      emailConfirmed: true,
      provider: ProviderEnum.GOOGLE,
    });
  }

  return successResponse({
    res,
    message: "User Login Successfully",
    data: {
      access_token: createAccessToken(userExist),
    },
  });
};
