import { Router } from "express";
import {
  getWishlistCustomerAnalytics,
  getWishlistProductAnalytics,
} from "../controllers/analyticalController";
import { getWishlistItems } from "../controllers/wishlistController";
const router = Router();

router.get("/:shopifyDomain/products", getWishlistProductAnalytics);

router.get("/:shopifyDomain/customers", getWishlistCustomerAnalytics);
router.get("/:shopifyDomain/:customerId", getWishlistItems);
export default router;
