import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},

		description: {
			type: String,
			required: true,
		},

		category: {
			type: String,
			required: true,
		},

		link: {
			type: String,
			default: "",
		},

		images: [
			{
				type: String,
			},
		],

		likesCount: {
			type: Number,
			default: 0,
		},

		commentsCount: {
			type: Number,
			default: 0,
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		likesCount: {
			type: Number,
			default: 0
		},

		commentsCount: {
			type: Number,
			default: 0
		}
	},
	{ timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

export default Project;