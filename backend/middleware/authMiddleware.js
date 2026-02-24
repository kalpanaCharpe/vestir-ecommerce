import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    // console.log("Decoded JWT:", req.user);
    next();
  } catch (err) {
    // res.status(401).json({ error: "Invalid or expired token" });
    next(err);
  }
};

export default authMiddleware;