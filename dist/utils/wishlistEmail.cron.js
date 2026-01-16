"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const wishlistEmailController_1 = require("../controllers/wishlistEmailController");
node_cron_1.default.schedule("0 9 * * *", async () => {
    try {
        await (0, wishlistEmailController_1.sendWishlistReminderEmails)({}, { json: console.log });
        console.log("Wishlist reminder cron executed");
    }
    catch (err) {
        console.error("Wishlist cron failed", err);
    }
});
node_cron_1.default.schedule("* * * * *", async () => {
    try {
        await (0, wishlistEmailController_1.sendWishlistReminderEmails)({}, { json: console.log });
        console.log("Wishlist reminder cron executed");
    }
    catch (err) {
        console.error("Wishlist cron failed", err);
    }
});
