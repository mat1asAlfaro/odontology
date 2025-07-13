const apiKeyAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "API KEY required" });

  const apiKey = authHeader.split(" ")[1];

  if (apiKey !== process.env.API_KEY)
    return res.status(403).json({ message: "Invalid API KEY" });

  next();
};

module.exports = apiKeyAuth;
