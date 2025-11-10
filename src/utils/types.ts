export interface WishlistItemInput {
  productId: string;
  variantId?: string;
  title: string;
  handle: string;
}

export interface ShopifyAuthenticatedHeaders {
  "x-shopify-shop-domain"?: string | string[];
  "x-shopify-user-id"?: string | string[];
  "x-shopify-authenticated-user-id"?: string | string[];
}
