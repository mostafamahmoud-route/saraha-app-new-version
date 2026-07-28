import { model, Schema } from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../utils/enums/user.enum.js";
import { decrypt } from "../../utils/security/encryption/encrypt.js";
import { DefaultProfilePicture } from "../../utils/constant/profile-images.constant.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == ProviderEnum.SYSTEM;
      },
    },
    username: {
      type: String,
      required: false,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      required: false,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    phone: {
      type: String,
      required: false,
    },
    provider: {
      type: String,
      default: ProviderEnum.SYSTEM,
    },
    profilePicture: {
      public_id: { type: String, default: DefaultProfilePicture.public_id },
      secure_url: { type: String, default: DefaultProfilePicture.secure_url },
    },
    deactivatedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("mobile").get(function () {
  return decrypt(this.phone);
});

export const User = model("User", userSchema);
