import { Router } from "express";
import {
  getWishlistCustomerAnalytics,
  getWishlistProductAnalytics,
} from "../controllers/analyticalController";

const router = Router();

router.get("/:shopifyDomain/products", getWishlistProductAnalytics);

router.get("/:shopifyDomain/customers", getWishlistCustomerAnalytics);

export default router;
