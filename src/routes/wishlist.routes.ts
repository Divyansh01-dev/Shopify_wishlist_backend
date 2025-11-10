import { Router } from "express";
import {
  addWishlistItem,
  // getWishlist,
} from "../controllers/wishlist.controller";

const router = Router();

router.post("/", addWishlistItem);
// router.get("/:customerId", getWishlist);

export default router;
