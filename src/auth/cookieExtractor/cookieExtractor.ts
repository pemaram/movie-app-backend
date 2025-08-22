import { Request } from 'express';

export const cookieExtractor = (req: Request): string => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refreshToken'];
  }
  return token;
};
