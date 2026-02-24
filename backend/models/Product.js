import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,      // e.g., Men, Women, Kids
        required: true,
        enum: ['Men', 'Women', 'Kids']
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String
    },

    image: {
        type: String     // store image URL
    },

    stock: {
        type: Number,
        default: 0
    },

},
    {
        timestamps: true
    });

export default mongoose.model("Product", productSchema);