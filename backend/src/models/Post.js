import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true
    },
    content: {
      type: String,
      maxLength: 4000,
    },
    typePost: {
        type: String,
        enum: ['grievance', 'announcement'],
        default: 'grievance'
    },
    image: {
      type: String,
      default: "",
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: function() {
        // Logic: Announcements are auto-approved, grievances need review
        return this.type === 'announcement' ? 'approved' : 'pending';
        }
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isResolved: {
        type: Boolean,
        default: false
    }
    
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;