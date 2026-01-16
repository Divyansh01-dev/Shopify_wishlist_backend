"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopifyApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Creates a configured Axios instance for Shopify API requests
 * @param shopifyStoreUrl - The Shopify store URL
 * @param shopifyAccessToken - The Shopify access token
 * @returns Configured Axios instance
 */
const shopifyApiClient = (shopifyStoreUrl, shopifyAccessToken) => {
    if (!shopifyStoreUrl || !shopifyAccessToken) {
        throw new Error("Shopify store URL and access token are required");
    }
    return axios_1.default.create({
        baseURL: shopifyStoreUrl,
        headers: {
            "X-Shopify-Access-Token": shopifyAccessToken,
            "Content-Type": "application/json",
        },
        timeout: 30000,
    });
};
exports.shopifyApiClient = shopifyApiClient;
