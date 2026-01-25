import User from "../models/User.model.js";
import { generateToken } from "../utils/token.js";

export const registerUser = async (req, res, next) => {
    
    try {
        const { username, email, password } = req.body;

        // validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." })
        }

        if (username.length < 3) {
            return res.status(400).json({ message: "Username should be at least 3 characters long" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters long" })
        }

        const existingUserName = await User.findOne({ username });
        if (existingUserName) {
            return res.status(400).json({ message: "Username already exists" })
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        // get random profile avatar
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`

        const user = new User({
            username,
            email,
            password,  // save pre-hook will hash the password
            profileImage
        })

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })
    } catch (error) {
        console.error("User Registration Error: ", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // check if password is correct
        const isPasswordCorrect = await user.comparePassword(password)

        if(!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })
    } catch (error) {
        console.error("User Login Error: ", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}