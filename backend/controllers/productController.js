import Product from "../models/Product.js";

// Create Product
export const createProduct = async (req, res, next) => {
    try {
        // console.log("File object:", req.file);
        // console.log(req.headers["content-type"]);
        const { name, price, category, stock, description } = req.body;

        // Cloudinary gives the uploaded image URL
        const image = req.file?.path || req.file?.url;

        if (!image) {
            return res.status(400).json({ error: "Image upload failed" });
        }

        const product = new Product({
            name,
            price,
            description,
            category,
            stock,
            image
        });

        // const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
        // next(err);
    }
};

// Get All Products
// export const getProducts = async (req, res, next) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (err) {
//         // res.status(500).json({ error: err.message });
//         next(err);
//     }
// };

// Get All Products with filters
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const filters = {};

    // Category filter
    if (category) {
      filters.category = category; // must match schema enum exactly (e.g., "Men", "Women", "Kids")
    }

    // Search filter (case-insensitive name match)
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    // Query builder
    let query = Product.find(filters);

    // Sorting
    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else if (sort === "name_asc") query = query.sort({ name: 1 });
    else query = query.sort({ createdAt: -1 }); // newest first

    // Pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(Number(limit));

    const products = await query;
    const total = await Product.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({ products, total, totalPages });
  } catch (err) {
    next(err);
  }
};

// Get Single Product
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        // res.status(500).json({ error: err.message });
        next(err);
    }
};

// Update Product
export const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        // res.status(500).json({ error: err.message });
        next(err);
    }
};

// Delete Product
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        // res.status(500).json({ error: err.message });
        next(err);
    }
};