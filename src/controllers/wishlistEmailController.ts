import prisma from "../db/prisma";
import { transporter } from "../utils/mailer";

export const sendWishlistReminderEmails = async (
  req: any,
  res: any
): Promise<any> => {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        email: { not: null },
        wishlist: {
          some: {},
        },
      },
      include: {
        wishlist: true,
        shop: true,
      },
    });

    if (!customers.length) {
      return res.json({ message: "No customers with wishlist found" });
    }

    for (const customer of customers) {
      const wishlistHtml = customer.wishlist
        .map(
          (item) => `
          <tr>
            <td><img src="${item.productImage}" width="60"/></td>
            <td>${item.productTitle}</td>
            <td>${item.productPrice ?? "-"}</td>
          </tr>
        `
        )
        .join("");

      await transporter.sendMail({
        from: `"${customer.shop.shopifyDomain}" <no-reply@wishlist.com>`,
        to: customer.email!,
        subject: "Items waiting in your wishlist!",
        html: `
          <h2>Hi ${customer.name ?? "there"},</h2>
          <p>You still have items waiting in your wishlist:</p>
          <table border="1" cellpadding="8">
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
            </tr>
            ${wishlistHtml}
          </table>
          <p>Don't miss out — grab them before they're gone!</p>
        `,
      });
    }

    return res.json({
      success: true,
      message: `Wishlist emails sent to ${customers.length} customers`,
    });
  } catch (error) {
    console.error("Wishlist Email Error:", error);
    return res.status(500).json({ error: "Failed to send wishlist emails" });
  }
};
