import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import wishlistRoutes from "./routes/wishlist.routes";
import authRoutes from "./routes/auth.routes";
import adminSettingRoutes from "./routes/admin.setting.routes";
import headlessWishlistRoutes from "./routes/wishlist.headless.routes";
import analyticalWishlistRoutes from "./routes/analytical.routes";

dotenv.config();

const app = express();
const baseUrl = "api";

app.use(cors());
app.use(express.json());

app.post("/webhooks/app/uninstalled", (req, res) => {
  console.log("App uninstalled webhook received:", req.body);

  res.status(200).send("OK");
});

app.post("/webhooks/app/scopes_update", (req, res) => {
  console.log("Scopes updated webhook received:", req.body);

  res.status(200).send("OK");
});

app.use(`/${baseUrl}/wishlist`, wishlistRoutes);
app.use(`/${baseUrl}/headless/wishlist`, headlessWishlistRoutes);
app.use(`/${baseUrl}/auth`, authRoutes);
app.use(`/${baseUrl}/settings`, adminSettingRoutes);
app.use(`/${baseUrl}/analytics`, analyticalWishlistRoutes);

app.get("/", (_, res) => {
  return res.status(200).json("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
