import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {

    try {
        const { name, email, password, role, phone } = req.body;

        if(!name.trim() && !email.trim() && !password.trim()) {
            return res.status(404).json({success: false, message: "Name, Email and Password fields are mandatory"});
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(500).json({success: false, message: "User already exists!"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            role,
            password: hashedPassword,
            phone
        })

        res.status(200).json({ 
            success: true, 
            message: "User successfully created!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: `Not able to create the user ${error}`})
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email.trim() || !password.trim()){
            return res.status(400).json({
                success: false,
                message: "Email and Password are mandatory field"
            })
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
          });
    }
}

export const getMe = async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
};