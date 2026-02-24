import User from "../models/User.js";

// Get logged-in user's profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
    // res.status(500).json({ error: err.message });
  }
};

// Update logged-in user's profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    // res.status(500).json({ error: err.message });
    next(err);
  }
};

//logut user profile 
export const logoutUser = async (req, res, next) => {
  try {
    // If using JWT in cookies, clear it
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

//delete our own profile
export const deleteOwnProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // comes from JWT via authMiddleware

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    res.json({ message: "Your profile has been deleted successfully" });
  } catch (err) {
    next(err);
  }
};


// Admin: Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    // res.status(500).json({ error: err.message });
    next(err);
  }
};

// Admin: Delete a user
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    // res.status(500).json({ error: err.message });
    next(err);
  }
};