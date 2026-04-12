import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		project: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;