import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import wishlistRoutes from "./routes/wishlist.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const baseUrl = "api";
app.use(cors());
app.use(express.json());

app.use(`/${baseUrl}/wishlist`, wishlistRoutes);
app.use(`/${baseUrl}/auth`, authRoutes);

const PORT = process.env.PORT || 5000;
app.get("/", (_, res) => {
  return res.status(200).json("Server is running");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
