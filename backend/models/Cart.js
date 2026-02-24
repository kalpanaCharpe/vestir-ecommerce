// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     products: [
//         {
//             product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//             quantity: { type: Number, default: 1 }
//         }
//     ]
// }, { timestamps: true });

// export default mongoose.model("Cart", cartSchema);

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
      size: { type: String },
      color: { type: String }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);