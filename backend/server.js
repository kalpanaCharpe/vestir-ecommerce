import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import userRoutes from "./routes/user.js";
import errorHandler from "./middleware/errorHandler.js";

// console.log(
//   process.env.CLOUDINARY_CLOUD_NAME,
//   process.env.CLOUDINARY_API_KEY,
//   process.env.CLOUDINARY_API_SECRET
// );

dotenv.config();
const app = express();

// Middleware
const allowedOrigins = [
  "https://vestir-ecommerce.vercel.app",
  "https://vestir-ecommerce-5n614sj0f-kalpana-charpes-projects.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}));

app.use(express.json());

// app.use(express.json()); // <-- parses JSON bodies
app.use(express.urlencoded({ extended: true })); // <-- parses form data

// Connect Database
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("server is running...");
});

//Routes 
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);


// Server Listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});