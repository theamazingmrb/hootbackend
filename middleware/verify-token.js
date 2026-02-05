const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // Make sure we have a token
    if (!token) {
      throw new Error("You must be authorized to access this content");
    }

    // decoded will return a error or the payload from the token
    const decoded = jwt.verify(token, process.env.SECRET);
    // add users info (username, _id) onto the request so we can use it
    // in tings like Task.find({owner: req.user._id})
    req.user = decoded.payload;

    next();
  } catch (error) {
    res.status(401).json({ err: error.message });
  }
}

module.exports = verifyToken;
