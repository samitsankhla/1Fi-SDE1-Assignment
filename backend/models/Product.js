const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true },
  color: { type: String, default: "" },
  imageUrl: { type: String, required: true },
});

const emiPlanSchema = new mongoose.Schema({
  monthlyPayment: { type: Number, required: true, min: 0 },
  tenureMonths: { type: Number, required: true, min: 1 },
  interestRate: { type: Number, required: true, min: 0 },
  cashback: { type: Number, default: 0, min: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, default: "" },
    mrp: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    variants: {
      type: [variantSchema],
      validate: {
        validator: (v) => v.length >= 1,
        message: "A product needs at least one variant.",
      },
    },
    emiPlans: {
      type: [emiPlanSchema],
      validate: {
        validator: (v) => v.length >= 1,
        message: "A product needs at least one EMI plan.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
