import User from "../models/user.js";
import jwt from "jsonwebtoken";


const isAuthenticated=async(req,res,next)=>{

    const {token}=req.cookies;
    if(!token){
        return res.status(400).json({
            success:false,
            message:"invalid token or has been expired"
        })
    }

    const decoded=jwt.verify(token,process.env.Token);
    if(!decoded){
        return res.status(400).json({
            success:false,
            message:"token does not match"
        })
    }
    req.user=await User.findById(decoded._id);
    next();
}


export default isAuthenticated;
