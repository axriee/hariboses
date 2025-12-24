import mongoose from "mongoose";    

const userSchema = new mongoose.Schema(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true,
        },
        plmEmail: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        profilePicture: {
            type: String,
            default: ""
        },
        // role determines if they are a student or an admin
        role: { 
            type: String, 
            enum: ['user', 'admin'], 
            default: 'user' 
        },
        // This satisfies your "Admin must approve account" requirement
        isApproved: { 
            type: Boolean, 
            default: false 
        }
    },
    { timestamps: true }

);


const User = mongoose.model("User", userSchema);

export default User;

