// ==================================================
// DNS + ENVIRONMENT
// ==================================================

const dns = require("dns");

// Helps MongoDB Atlas SRV resolution in some environments.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

// ==================================================
// PRODUCT IMAGE URLS
// ==================================================

// ------------------------------
// iPhone 17 Pro
// ------------------------------

const iphoneOrangeImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/IPhone_17_Pro_backside_%28Cosmic_Orange%29_%28Oct_1%2C_2025%29.jpg";

const iphoneSilverImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/IPhone_17_Pro_%28Silver%29_-_Backside.jpg";

const iphoneBlueImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/IPhone_17_Pro_backside_%28Deep_Blue%29_%28Oct_1%2C_2025%29.jpg";

// ------------------------------
// Samsung S24 Ultra
// ------------------------------
// These images are served by Vite from:
// frontend/public/images/

const samsungBlackImage = "/images/samsung-black.jpg";

const samsungTitaniumImage = "/images/samsung-titanium.jpg";

const samsungGrayImage = "/images/samsung-gray.jpg";

// ------------------------------
// OnePlus 13
// ------------------------------
// These images are served by Vite from:
// frontend/public/images/

const oneplusBlackImage = "/images/oneplus-black.jpg";

const oneplusBlueImage = "/images/oneplus-blue.jpg";

const oneplusGreenImage = "/images/oneplus-green.jpg";

// ==================================================
// PRODUCTS
// ==================================================

const products = [
  // ==================================================
  // IPHONE 17 PRO
  // ==================================================

  {
    name: "iPhone 17 Pro",

    slug: "iphone-17-pro",

    description:
      "Titanium-class camera system with the A19 Pro chip. Premium smartphone with multiple storage variants.",

    mrp: 134900,

    price: 127400,

    variants: [
      {
        type: "Storage",
        value: "256GB",
        color: "Orange",
        imageUrl: iphoneOrangeImage,
      },

      {
        type: "Storage",
        value: "512GB",
        color: "Silver",
        imageUrl: iphoneSilverImage,
      },

      {
        type: "Storage",
        value: "1TB",
        color: "Blue",
        imageUrl: iphoneBlueImage,
      },
    ],

    emiPlans: [
      {
        monthlyPayment: 44967,
        tenureMonths: 3,
        interestRate: 0,
        cashback: 7500,
      },

      {
        monthlyPayment: 22483,
        tenureMonths: 6,
        interestRate: 0,
        cashback: 7500,
      },

      {
        monthlyPayment: 11242,
        tenureMonths: 12,
        interestRate: 0,
        cashback: 7500,
      },

      {
        monthlyPayment: 5621,
        tenureMonths: 24,
        interestRate: 0,
        cashback: 7500,
      },

      {
        monthlyPayment: 4297,
        tenureMonths: 36,
        interestRate: 10.5,
        cashback: 7500,
      },

      {
        monthlyPayment: 3385,
        tenureMonths: 48,
        interestRate: 10.5,
        cashback: 7500,
      },

      {
        monthlyPayment: 2842,
        tenureMonths: 60,
        interestRate: 10.5,
        cashback: 7500,
      },
    ],
  },

  // ==================================================
  // SAMSUNG S24 ULTRA
  // ==================================================

  {
    name: "Samsung S24 Ultra",

    slug: "samsung-s24-ultra",

    description:
      "Flagship Android smartphone with an S Pen, a 200MP camera and premium storage options.",

    mrp: 129999,

    price: 109999,

    variants: [
      {
        type: "Storage",
        value: "256GB",
        color: "Black",
        imageUrl: samsungBlackImage,
      },

      {
        type: "Storage",
        value: "512GB",
        color: "Titanium",
        imageUrl: samsungTitaniumImage,
      },

      {
        type: "Storage",
        value: "1TB",
        color: "Gray",
        imageUrl: samsungGrayImage,
      },
    ],

    emiPlans: [
      {
        monthlyPayment: 36667,
        tenureMonths: 3,
        interestRate: 0,
        cashback: 5000,
      },

      {
        monthlyPayment: 18333,
        tenureMonths: 6,
        interestRate: 0,
        cashback: 5000,
      },

      {
        monthlyPayment: 9167,
        tenureMonths: 12,
        interestRate: 0,
        cashback: 5000,
      },

      {
        monthlyPayment: 5080,
        tenureMonths: 24,
        interestRate: 10.5,
        cashback: 5000,
      },

      {
        monthlyPayment: 3664,
        tenureMonths: 36,
        interestRate: 10.5,
        cashback: 5000,
      },
    ],
  },

  // ==================================================
  // ONEPLUS 13
  // ==================================================

  {
    name: "OnePlus 13",

    slug: "oneplus-13",

    description:
      "High-performance smartphone with Snapdragon 8 Elite and fast charging across multiple storage variants.",

    mrp: 84999,

    price: 74999,

    variants: [
      {
        type: "Storage",
        value: "256GB",
        color: "Black",
        imageUrl: oneplusBlackImage,
      },

      {
        type: "Storage",
        value: "512GB",
        color: "Blue",
        imageUrl: oneplusBlueImage,
      },

      {
        type: "Storage",
        value: "1TB",
        color: "Green",
        imageUrl: oneplusGreenImage,
      },
    ],

    emiPlans: [
      {
        monthlyPayment: 24997,
        tenureMonths: 3,
        interestRate: 0,
        cashback: 3000,
      },

      {
        monthlyPayment: 12499,
        tenureMonths: 6,
        interestRate: 0,
        cashback: 3000,
      },

      {
        monthlyPayment: 6250,
        tenureMonths: 12,
        interestRate: 0,
        cashback: 3000,
      },

      {
        monthlyPayment: 3470,
        tenureMonths: 24,
        interestRate: 10.5,
        cashback: 3000,
      },

      {
        monthlyPayment: 2500,
        tenureMonths: 36,
        interestRate: 10.5,
        cashback: 3000,
      },
    ],
  },
];

// ==================================================
// DATABASE SEED
// ==================================================

async function seedDatabase() {
  try {
    // Check MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB.");

    // Delete old products
    await Product.deleteMany({});

    console.log("Old products deleted.");

    // Insert new products
    await Product.insertMany(products);

    console.log("MongoDB seeded successfully.");

    console.log(`${products.length} products inserted.`);
  } catch (error) {
    console.error("Database error:", error.message);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();

    console.log("MongoDB connection closed.");
  }
}

// ==================================================
// START SEED
// ==================================================

seedDatabase();