import { Router } from "express";
import {
  addWishlistItem,
  getWishlistItems,
  removeItemFromWishlist,
} from "../controllers/wishlistController";

const router = Router();

router.post("/", addWishlistItem);
router.get("/:customerId", getWishlistItems);
router.delete("/:customerId/:variantId", removeItemFromWishlist);

export default router;
