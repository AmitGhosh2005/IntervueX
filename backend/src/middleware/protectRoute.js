import { requireAuth } from '@clerk/express';
import User from '../models/User.js';

export const protectRoute = [
    requireAuth(),
    async(req,res,next)=>{
        try {
            const clerkId = req.auth().userId;
            if(!clerkId) return res.status(404).json({msg: "Unauthorized - invalid token"});

            //find user in db by clerk id
            const user = User.findOne({clerkId});

            if(!user) return res.status(404).json({msg: "user not found"});

            //attch user to req
            req.user = user;

            next();
        } catch (error) {
            console.error("Eroor in protectRoute middleware", error);
            res.status(500).json({message: "Internal server error"});
        }
    }
]

