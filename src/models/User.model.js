import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profileImage: {
        type: String,
        default: ""
    }
}, { timestamps: true });

// hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // next();
    // in Mongoose pre-save hook, async fn. doesn't require next()
    // to be explictly called, it is handled automatically.
})

// function to compare password on login
userSchema.methods.comparePassword = async function(userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;