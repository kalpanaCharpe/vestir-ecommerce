import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Place Order
export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's cart with product details
    const cart = await Cart.findOne({ user: userId }).populate("products.product");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Build products array with price at time of order
    const products = cart.products.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Calculate total price
    const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Create order
    const order = new Order({
      user: userId,
      products,
      totalPrice,
      status: "Pending"
    });

    await order.save();

    // Clear cart after placing order
    cart.products = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// Get User Orders
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Delete order by user
export const deleteOrder = async (req, res, next) => {
  try {
    const userId = req.user.id; // from token
    const { orderId } = req.params;

    const order = await Order.findOneAndDelete({ _id: orderId, user: userId });
    if (!order) return res.status(404).json({ error: "Order not found or not yours" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    next(err);
  }
};