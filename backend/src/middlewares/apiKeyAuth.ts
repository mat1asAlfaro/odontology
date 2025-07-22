import { Request, Response, NextFunction } from 'express';

const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "API KEY required" });
    return;
  }

  const apiKey = authHeader.split(' ')[1];

  if (apiKey !== process.env.API_KEY) {
    res.status(403).json({ message: "Invalid API KEY" });
    return;
  }

  next();
};

export default apiKeyAuth;
