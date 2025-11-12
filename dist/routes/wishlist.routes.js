"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlistController_1 = require("../controllers/wishlistController");
const router = (0, express_1.Router)();
router.post("/", wishlistController_1.addWishlistItem);
router.get("/:shopifyDomain/:customerId", wishlistController_1.getWishlistItems);
router.delete("/:shopifyDomain/:customerId/:variantId", wishlistController_1.removeItemFromWishlist);
exports.default = router;
