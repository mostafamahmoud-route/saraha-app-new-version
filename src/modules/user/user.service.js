import { User } from "../../db/models/user.model.js";
import { DefaultProfilePicture } from "../../utils/constant/profile-images.constant.js";
import { BadRequestException } from "../../utils/response/error.response.js";
import { successResponse } from "../../utils/response/success.response.js";
import cloudinary from "../../utils/upload/cloudinary.util.js";

export const uploadProfilePicture = async (req, res, next) => {
  const options = {};

  if (req.user.profilePicture.public_id == DefaultProfilePicture.public_id) {
    options.folder = `users/${req.user.id}/profile-pictures`;
  } else {
    options.public_id = req.user.profilePicture.public_id;
  }

  // upload file to cloud
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    options
  );

  if (!public_id || !secure_url) {
    return BadRequestException("Failed to upload profile picture");
  }

  // save file to database
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePicture: {
        public_id,
        secure_url,
      },
    },
    {
      new: true,
      select: "-password",
    }
  );

  return successResponse({
    res,
    message: "Profile picture uploaded successfully",
    data: user,
    statusCode: 200,
  });
};

export const deactivateAccount = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { deactivatedAt: new Date() },
    { new: true, select: "-password" }
  );
  return user;
};
