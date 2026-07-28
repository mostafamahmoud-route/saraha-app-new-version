import connectDB from "./db/db-connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import { globalErrorHandler } from "./utils/response/error.response.js";
import cors from "cors";
import userRouter from "./modules/user/user.controller.js";
import { deleteDeactivatedAccounts } from "./modules/user/cron/delete-deactivated-users.js";
import { successResponse } from "./utils/response/success.response.js";

const bootStrap = async (express, app) => {
  await connectDB();

  app.use(cors("*"));

  app.use(express.json());
  deleteDeactivatedAccounts();
  app.get("/", (req, res, next) => {
    return res
      .status(200)
      .json({ success: true, message: "Hello from Saraha App" });
  });

  app.use("/auth", authRouter);

  app.use("/user", userRouter);

  app.get("/", (req, res, next) => {
    return res
      .status(200)
      .json({ success: true, message: "Hello from Saraha App" });
  });

  app.all("/*ay7aga", (req, res, next) => {
    return res
      .status(404)
      .json({ success: false, message: "This Route Is Not Exist" });
  });

  app.use(globalErrorHandler);
};

export default bootStrap;
