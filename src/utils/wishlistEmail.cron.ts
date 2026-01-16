import cron from "node-cron";
import axios from "axios";
import { sendWishlistReminderEmails } from "../controllers/wishlistEmailController";

cron.schedule("0 9 * * *", async () => {
  try {
    await sendWishlistReminderEmails({} as any, { json: console.log } as any);
    console.log("Wishlist reminder cron executed");
  } catch (err) {
    console.error("Wishlist cron failed", err);
  }
});
cron.schedule("* * * * *", async () => {
  try {
    await sendWishlistReminderEmails({} as any, { json: console.log } as any);
    console.log("Wishlist reminder cron executed");
  } catch (err) {
    console.error("Wishlist cron failed", err);
  }
});
