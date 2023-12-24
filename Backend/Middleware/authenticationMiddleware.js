const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;
    

  if (!cookie) {
    return res.status(401).json({ message: "No Cookie provided" });
  }
   const token = req.cookies.token;
   if (!token) {
    return res.status(401).json({ message: "No token provided" });
   }

  
  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach the decoded user ID to the request object for further use
    // console.log(decoded.user)
    
    req.user = decoded.user;
    next();
  }

)};