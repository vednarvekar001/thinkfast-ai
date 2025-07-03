import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
