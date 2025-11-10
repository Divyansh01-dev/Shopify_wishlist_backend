import { Router } from "express";
import {
  addWishlistItem,
  getWishlistItems,
} from "../controllers/wishlistController";

const router = Router();

router.post("/", addWishlistItem);
router.get("/:customerId", getWishlistItems);

export default router;
