import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const protectRoute = async (req, res, next) => {
    try {
        // get token from authorization header
        const token = req.header("Authorization").replace("Bearer ", "");

        if(!token) {
            return res.status(401).json({ messsage: "unathorized" })
        }

        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get the user based on token
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(401).json({ message: "Invalid token" })
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error: ", error);
        
    }
}

export default protectRoute;