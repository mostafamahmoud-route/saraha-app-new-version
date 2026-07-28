import cron from "node-cron";
import { User } from "../../../db/models/user.model.js";

/**
 * *    *   *   *   *   *   *
 * |     |   |   |   |   |   |
 * sec min hour day month dayOfWeek
 */
// 00:00
export const deleteDeactivatedAccounts = async () => {
  cron.schedule("*/10 * 0,5,11,17,23 * * *", async () => {
    console.log("Cron job started");

    const users = await User.find({ deactivatedAt: { $exists: true } });

    for (const user of users) {
      if (user.deactivatedAt.getTime() + 1000 * 5 < Date.now()) {
        await User.findByIdAndDelete(user._id);
        console.log(`User with id ${user._id} deleted`);
      }
    }
  });
};

// 1784050429 // 10000
// 1784060434

// 1784050500

// expire date    now
// 1784060434 || 1784050500
