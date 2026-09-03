
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();



require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : true; // allow all origins if not configured (fine for local dev)

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "1Fi EMI Store API",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ==================================================
// PRODUCTS
// ==================================================

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: 1 }).lean();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch products" });
  }
});

app.get("/api/products/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug.toLowerCase(),
    }).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch product" });
  }
});

// ==================================================
// ORDER PREVIEW
// ==================================================
// Validates a chosen variant + EMI plan against the product in the
// database, so the client can never "trust" its own local numbers.

app.post("/api/orders/preview", async (req, res) => {
  try {
    const { productSlug, variantId, emiPlanId } = req.body;

    if (!productSlug || !variantId || !emiPlanId) {
      return res.status(400).json({
        message: "productSlug, variantId and emiPlanId are required",
      });
    }

    const product = await Product.findOne({
      slug: productSlug.toLowerCase(),
    }).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variant = product.variants.find(
      (v) => v._id.toString() === variantId.toString()
    );
    const emiPlan = product.emiPlans.find(
      (p) => p._id.toString() === emiPlanId.toString()
    );

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    if (!emiPlan) {
      return res.status(404).json({ message: "EMI plan not found" });
    }

    res.json({
      message: "Selected plan is ready to proceed",
      selection: {
        product: product.name,
        slug: product.slug,
        variant,
        emiPlan,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to process selection" });
  }
});

// ==================================================
// 404 + ERROR HANDLING
// ==================================================

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

// ==================================================
// START
// ==================================================

(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully.");

    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
})();

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  process.exit(0);
});
