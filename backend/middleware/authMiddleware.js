import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success: false,
                message: "Not authorized. Token is missing.",
			});
        }

        const token = authHeader.split(" ")[1];

        const decode = jwt.verify(
            token, 
            process.env.JWT_SECRET
        )

        //this line code is extracting user data without password [Give me the user, except the password field.]
        const user = await User.findById(decode.userId).select("-password"); 

        if (!user) {
			return res.status(401).json({
				success: false,
				message: "User no longer exists.",
			});
        }
    
        //here we attach the user data to the request
        req.user = user;
    
        //Authentication succeeded. Continue to the next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Invalid or expired token.",
		});
    }
}

export default protect;