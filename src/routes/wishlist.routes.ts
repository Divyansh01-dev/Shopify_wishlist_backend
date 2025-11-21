import { Router } from "express";
import {
  addWishlistItem,
  getWishlistItems,
  removeItemFromWishlist,
} from "../controllers/wishlistController";
import { verifyApiKey } from "../middleware/auth.middleware";

const router = Router();
router.use(verifyApiKey);
router.post("/", addWishlistItem);
router.get("/:shopifyDomain/:customerId", getWishlistItems);
router.delete("/:shopifyDomain/:customerId/:variantId", removeItemFromWishlist);

export default router;
