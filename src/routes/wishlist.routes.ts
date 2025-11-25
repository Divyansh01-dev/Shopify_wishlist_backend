import { Router } from "express";
import {
  addWishlistItem,
  getWishlistItems,
  removeItemFromWishlist,
} from "../controllers/wishlistController";
import { verifyShopifyProxy } from "../middleware/auth.middleware";

const router = Router();
router.use(verifyShopifyProxy);
router.post("/", addWishlistItem);
router.get("/:shopifyDomain/:customerId", getWishlistItems);
router.delete("/:shopifyDomain/:customerId/:variantId", removeItemFromWishlist);

export default router;
