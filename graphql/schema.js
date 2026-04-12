import { gql } from "graphql-tag";

const typeDefs = gql`
	type AuthPayload {
	token: String!
	user: User!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		avatar: String
		description: String
		area: String
		contact: String
		projectsCount: Int!
		followersCount: Int!
		followingCount: Int!
	}

	type Project {
		id: ID!
		title: String!
		description: String!
		category: String
		link: String
		images: [String]
		user: User
		createdAt: String
		likesCount: Int
		commentsCount: Int
	}

	type Comment {
		id: ID!
		text: String!
		user: User
		project: Project
		createdAt: String
	}

	type Like {
		id: ID!
		user: User
		project: Project
	}

	type Notification {
		id: ID!
		type: String!
		message: String!
		read: Boolean!
		createdAt: String!
		actor: User
		project: Project
	}

	type Query {
		me: User
		user(id: ID!): User
		searchUsers(name: String!): [User!]!
		searchProjectsByTitle(title: String!): [Project!]!
		projects: [Project!]!
		project(id: ID!): Project
		projectsByUser(userId: ID!): [Project!]!
		projectsByCategory(category: String!): [Project!]!
		mostLikedProjects: [Project!]!
		projectComments(projectId: ID!): [Comment!]!
		likedProjects: [Project!]!
		projectLikes(projectId: ID!): [Like!]!
		mostCommentedProjects: [Project!]!
		notifications: [Notification!]!
	}

	type Mutation {

		login(
			email: String!, 
			password: String!
		): AuthPayload

		register(
			name: String!
			email: String!
			password: String!
			area: String
		): AuthPayload

		followUser(
			userId: ID!
		): Boolean
		
		unfollowUser(
			userId: ID!
		): Boolean

		updateProfile(
			avatar: String
			description: String
			area: String
			contact: String
		): User

		createProject(
			title: String!
			description: String!
			category: String
			link: String
			images: [String]
		): Project

		updateProject(
			projectId: ID!
			title: String
			description: String
			category: String
			link: String
			images: [String]
		): Project

		deleteProject(
			projectId: ID!
		): Boolean
			
		createComment(
			projectId: ID!
			text: String!
		): Comment

		updateComment(
			commentId: ID!
			text: String!
		): Comment
				
		deleteComment(
			commentId: ID!
		): Boolean
		
		likeProject(
			projectId: ID!
		): Like
		
		unlikeProject(
			projectId: ID!
		): Boolean
		markNotificationAsRead(
			id: ID!
		): Boolean
		markAllNotificationsAsRead: Boolean
	}
`;

export default typeDefs;