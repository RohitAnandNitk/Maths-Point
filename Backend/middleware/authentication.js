const jwt = require("jsonwebtoken");
const secret_key = "$uperman1235";

function authMiddleware(req, res, next) {
  let token;

  // check cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // console.log("Token in auth : ", token);
  // check Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }

  try {
    const user = jwt.verify(token, secret_key);
    req.user = user; // 👈 here we attach it
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ msg: "Unauthorized: Invalid token" });
  }
}

module.exports = authMiddleware;
