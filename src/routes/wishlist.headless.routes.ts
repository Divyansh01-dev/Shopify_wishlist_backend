import { Router } from "express";
import {
  addWishlistItem,
  getWishlistItems,
  removeItemFromWishlist,
} from "../controllers/wishlistController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();
router.post("/", verifyToken, addWishlistItem);
router.get("/:shopifyDomain/:customerId", verifyToken, getWishlistItems);
router.delete(
  "/:shopifyDomain/:customerId/:variantId",
  verifyToken,
  removeItemFromWishlist
);

export default router;
