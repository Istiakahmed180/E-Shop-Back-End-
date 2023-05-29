const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const { authentication } = req.headers;
  try {
    const token = authentication.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userName, userID } = decoded;
    req.userName = userName;
    req.userID = userID;
    next();
  } catch {
    next("Authentication Failure");
  }
};

module.exports = checkLogin;
