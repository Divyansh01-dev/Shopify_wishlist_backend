"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_setting_routes_1 = __importDefault(require("./routes/admin.setting.routes"));
const wishlist_headless_routes_1 = __importDefault(require("./routes/wishlist.headless.routes"));
const analytical_routes_1 = __importDefault(require("./routes/analytical.routes"));
dotenv_1.default.config();
require("./utils/wishlistEmail.cron");
const app = (0, express_1.default)();
const baseUrl = "api";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/webhooks/app/uninstalled", (req, res) => {
    console.log("App uninstalled webhook received:", req.body);
    res.status(200).send("OK");
});
app.post("/webhooks/app/scopes_update", (req, res) => {
    console.log("Scopes updated webhook received:", req.body);
    res.status(200).send("OK");
});
app.use(`/${baseUrl}/wishlist`, wishlist_routes_1.default);
app.use(`/${baseUrl}/headless/wishlist`, wishlist_headless_routes_1.default);
app.use(`/${baseUrl}/auth`, auth_routes_1.default);
app.use(`/${baseUrl}/settings`, admin_setting_routes_1.default);
app.use(`/${baseUrl}/analytics`, analytical_routes_1.default);
app.get("/", (_, res) => {
    return res.status(200).json("Server is running");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
