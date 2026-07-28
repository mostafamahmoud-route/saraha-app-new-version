import { Router } from "express";
import { fileFormats, uploadFile } from "../../utils/upload/multer.util.js";
import { successResponse } from "../../utils/response/success.response.js";
import { deactivateAccount, uploadProfilePicture } from "./user.service.js";
import { isAuthenticate } from "../../middleware/authentication.middleware.js";

const router = Router();

router.post(
  "/upload-profile-picture",
  isAuthenticate,
  uploadFile(fileFormats.imageMimeTypes).single("image"),
  uploadProfilePicture
);

router.put("/deactivate-account", isAuthenticate, async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const user = await deactivateAccount(userId);
    return successResponse({
      res,
      statusCode: 200,
      message: "Account deactivated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
