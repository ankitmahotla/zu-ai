import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user';

interface JwtPayload {
  _id: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export async function verifyJWT(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as JwtPayload;

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in verifyJWT:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid access token" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}