import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import wishlistRoutes from "./routes/wishlist.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
