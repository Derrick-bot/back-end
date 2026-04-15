import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Project from "../models/Project.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Follow from "../models/Follow.js";
import Notification from "../models/Notification.js";

const resolvers = {
	Query: {
		me: async (_, __, { user }) => {
			if (!user) throw new Error("Não autenticado")
			return user
		},

		user: async (_, { id }) => {
			const user = await User.findById(id);

			if (!user) {
				throw new Error("Usuário não encontrado");
			}

			return user;
		},

		searchUsers: async (_, { name }) => {
			return User.find({
				name: { $regex: name, $options: "i" }
			}).limit(10);
		},

		projects: async (_, { title, category, userId }) => {

			const filter = {};

			if (title) {
				filter.title = { $regex: title, $options: "i" };
			}

			if (category) {
				filter.category = category;
			}

			if (userId) {
				filter.user = userId;
			}

			return Project.find(filter)
				.populate("user")
				.sort({ createdAt: -1 });
		},

		project: async (_, { id }) => {
			const project = await Project.findById(id).populate("user");

			if (!project) throw new Error("Projeto não encontrado");

			return project;
		},

		searchProjectsByTitle: async (_, { title }) => {
			return Project.find({
				title: { $regex: title, $options: "i" }
			}).populate("user");
		},

		projectsByCategory: async (_, { category }) => {
			return Project.find({ category })
				.populate("user")
				.sort({ createdAt: -1 });
		},

		projectsByUser: async (_, { userId }) => {
			return Project.find({ user: userId })
				.populate("user")
				.sort({ createdAt: -1 });
		},

		mostLikedProjects: async () => {
			return Project.find()
				.populate("user")
				.sort({ likesCount: -1 })
				.limit(20);
		},

		mostCommentedProjects: async () => {
			return Project.find()
				.populate("user")
				.sort({ commentsCount: -1 })
				.limit(20);
		},

		projectComments: async (_, { projectId }) => {
			return Comment.find({ project: projectId })
				.populate("user")
				.sort({ createdAt: -1 });
		},

		projectLikes: async (_, { projectId }) => {
			return Like.find({ project: projectId })
				.populate("user")
				.populate("project");
		},

		likedProjects: async (_, __, { user }) => {
			if (!user) throw new Error("Não autenticado");

			const likes = await Like.find({ user: user._id }).populate({
				path: "project",
				populate: { path: "user" }
			});

			return likes.map((like) => like.project);
		},

		notifications: async (_, __, { user }) => {
			if (!user) throw new Error("Não autenticado");

			return Notification.find({ recipient: user._id })
				.populate("actor")
				.populate("project")
				.sort({ createdAt: -1 });
		},
	},

	Mutation: {
		login: async (_, { email, password }) => {

			const user = await User.findOne({ email });

			if (!user) {
				throw new Error("Usuário não encontrado");
			}

			const valid = await bcrypt.compare(password, user.password);

			if (!valid) {
				throw new Error("Senha inválida");
			}

			const token = jwt.sign(
				{ id: user._id },
				process.env.JWT_SECRET,
				{ expiresIn: "7d" }
			);

			const userObj = user.toObject();
			delete userObj.password;

			return {
				token,
				user: userObj
			};
		},

		register: async (_, { name, email, password, area }) => {

			const existingUser = await User.findOne({ email });

			if (existingUser) {
				throw new Error("Email já está em uso");
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const user = await User.create({
				name,
				email,
				password: hashedPassword,
				area,
				createdAt: new Date()
			});

			const token = jwt.sign(
				{ id: user._id },
				process.env.JWT_SECRET,
				{ expiresIn: "7d" }
			);

			const userObj = user.toObject();
			delete userObj.password;

			return {
				token,
				user: userObj
			};
		},

		followUser: async (_, { userId }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			if (userId === user._id.toString()) {
				throw new Error("Você não pode seguir a si mesmo");
			}

			const existing = await Follow.findOne({
				follower: user._id,
				following: userId,
			});

			if (existing) {
				throw new Error("Você já segue este usuário");
			}

			await Follow.create({
				follower: user._id,
				following: userId,
			});

			await Notification.create({
				type: "follow",
				recipient: userId,
				actor: user._id,
				message: `${user.name} começou a seguir você`,
			});

			return true;
		},

		unfollowUser: async (_, { userId }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			await Follow.findOneAndDelete({
				follower: user._id,
				following: userId,
			});

			return true;
		},

		updateProfile: async (_, { avatar, description, area, contact }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			const updatedUser = await User.findByIdAndUpdate(
				user._id,
				{
					...(avatar && { avatar }),
					...(description && { description }),
					...(area && { area }),
					...(contact && { contact })
				},
				{ new: true }
			);

			return updatedUser;
		},

		createProject: async (_, { images, ...data }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			const project = await Project.create({
				...data,
				images: images || [],
				user: user._id,
			});

			return Project.findById(project._id).populate("user");
		},

		updateProject: async (_, { projectId, title, description, category, link, images }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			const project = await Project.findById(projectId);

			if (!project) {
				throw new Error("Projeto não encontrado");
			}

			if (project.user.toString() !== user._id.toString()) {
				throw new Error("Não autorizado");
			}

			const updatedProject = await Project.findByIdAndUpdate(
				projectId,
				{
					...(title && { title }),
					...(description && { description }),
					...(category && { category }),
					...(link && { link }),
					...(images && { images }),
				},
				{ new: true }
			).populate("user");

			return updatedProject;
		},

		deleteProject: async (_, { projectId }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			const project = await Project.findById(projectId);

			if (!project) {
				throw new Error("Projeto não encontrado");
			}

			if (project.user.toString() !== user._id.toString()) {
				throw new Error("Não autorizado");
			}

			await Comment.deleteMany({ project: projectId });

			await Like.deleteMany({ project: projectId });

			await Project.findByIdAndDelete(projectId);

			return true;
		},

		createComment: async (_, { projectId, text }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			const project = await Project.findById(projectId);
			if (!project) throw new Error("Projeto não encontrado");

			const comment = await Comment.create({
				text,
				user: user._id,
				project: projectId,
			});

			await Project.findByIdAndUpdate(projectId, {
				$inc: { commentsCount: 1 },
			});

			await Notification.create({
				type: "comment",
				recipient: project.user,
				actor: user._id,
				project: projectId,
				message: `${user.name} comentou no seu projeto`,
			});

			return Comment.findById(comment._id).populate("user");
		},

		updateComment: async (_, { commentId, text }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			const comment = await Comment.findById(commentId);

			if (!comment) {
				throw new Error("Comentário não encontrado");
			}

			if (comment.user.toString() !== user._id.toString()) {
				throw new Error("Não autorizado");
			}

			comment.text = text;

			await comment.save();

			return comment;
		},

		deleteComment: async (_, { commentId }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			const comment = await Comment.findById(commentId);

			if (!comment) {
				throw new Error("Comentário não encontrado");
			}

			if (comment.user.toString() !== user._id.toString()) {
				throw new Error("Não autorizado");
			}

			await Comment.findByIdAndDelete(commentId);

			await Project.findByIdAndUpdate(
				comment.project,
				{ $inc: { commentsCount: -1 } }
			);

			return true;
		},

		likeProject: async (_, { projectId }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			const project = await Project.findById(projectId);
			const existingLike = await Like.findOne({
				user: user._id,
				project: projectId,
			});

			if (existingLike) throw new Error("Você já curtiu este projeto");

			const like = await Like.create({
				user: user._id,
				project: projectId,
			});

			await Project.findByIdAndUpdate(
				projectId,
				{ $inc: { likesCount: 1 } }
			);

			await Notification.create({
				type: "like",
				recipient: project.user,
				actor: user._id,
				project: projectId,
				message: `${user.name} curtiu seu projeto`,
			});

			return Like.findById(like._id).populate("user");
		},

		unlikeProject: async (_, { projectId }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			const like = await Like.findOneAndDelete({
				user: user._id,
				project: projectId,
			});

			if (like) {
				await Project.findByIdAndUpdate(
					projectId,
					{ $inc: { likesCount: -1 } }
				);
			}

			return true;
		},

		markNotificationAsRead: async (_, { id }, { user }) => {
			if (!user) throw new Error("Não autenticado");

			await Notification.findOneAndUpdate(
				{ _id: id, recipient: user._id },
				{ read: true }
			);

			return true;
		},

		markAllNotificationsAsRead: async (_, __, { user }) => {
			if (!user) throw new Error("Não autenticado");

			await Notification.updateMany(
				{ recipient: user._id },
				{ read: true }
			);

			return true;
		},
	},

	User: {
		id: (parent) => parent._id.toString(),

		projectsCount: async (parent) => {
			return Project.countDocuments({ user: parent._id });
		},

		followersCount: async (parent) => {
			return Follow.countDocuments({ following: parent._id });
		},

		followingCount: async (parent) => {
			return Follow.countDocuments({ follower: parent._id });
		},

		followedByMe: async (parent, _, { user }) => {
			if (!user) return false

				const follow = await Follow.findOne({
					follower: user._id,
					following: parent._id
				})

				return !!follow
		}
	},

	Project: {
		id: (parent) => parent._id.toString(),

		likedByMe: async (parent, _, { user }) => {
			if (!user) return false

			const like = await Like.findOne({
				user: user._id,
				project: parent._id,
			})

			return !!like
		}
	},

	Comment: {
		id: (parent) => parent._id.toString()
	}
};

export default resolvers;
