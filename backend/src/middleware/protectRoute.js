import { getAuth } from '@clerk/express';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    try {
            const { userId: clerkId } = getAuth(req);

            if (!clerkId) return res.status(401).json({ msg: "Unauthorized" });


            //find user in db by clerk id
            const user = await User.findOne({clerkId});
            if (!user) return res.status(404).json({ msg: "User not found" });

            //attch user to req
            req.user = user;

            next();
    } catch (error) {
        console.error("Error in protectRoute middleware", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
