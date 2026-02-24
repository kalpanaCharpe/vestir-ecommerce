import Cart from "../models/Cart.js";

// Helper to format cart response
const formatCartResponse = (cart) => {
  cart.products = cart.products || []; // guard

  const items = cart.products.map(p => ({
    product: p.product,
    quantity: p.quantity,
    size: p.size,
    color: p.color
  }));

  const total = items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return { items, total };
};

// Add item to cart
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, size, color } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] }); // initialize products
    }

    cart.products = cart.products || [];

    const itemIndex = cart.products.findIndex(
      p => p.product.toString() === productId && p.size === size && p.color === color
    );

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity, size, color });
    }

    await cart.save();
    await cart.populate("products.product");

    res.json(formatCartResponse(cart));
  } catch (err) {
    next(err);
  }
};

// Remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, size, color } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products || [];
    cart.products = cart.products.filter(
      p => !(p.product.toString() === productId && p.size === size && p.color === color)
    );

    await cart.save();
    await cart.populate("products.product");

    res.json(formatCartResponse(cart));
  } catch (err) {
    next(err);
  }
};

// Get user cart
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("products.product");
    if (!cart) return res.json({ items: [], total: 0 });

    res.json(formatCartResponse(cart));
  } catch (err) {
    next(err);
  }
};

// Update quantity of an item
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, size, color } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products || [];
    const itemIndex = cart.products.findIndex(
      p => p.product.toString() === productId && p.size === size && p.color === color
    );
    if (itemIndex === -1) return res.status(404).json({ error: "Product not in cart" });

    cart.products[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate("products.product");

    res.json(formatCartResponse(cart));
  } catch (err) {
    next(err);
  }
};

// Clear cart
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products || [];
    cart.products = [];

    await cart.save();
    await cart.populate("products.product");

    res.json(formatCartResponse(cart));
  } catch (err) {
    next(err);
  }
};