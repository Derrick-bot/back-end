import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";
import { context } from "./graphql/context.js";

dotenv.config();

const app = express();

app.use(cors({
	origin: process.env.FRONTEND_URL || "http://localhost:3000",
	credentials: true,
}));

app.use(express.json());

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

await server.start();

app.use(
	"/graphql",
	expressMiddleware(server, {
		context,
	})
);

app.get("/", (req, res) => {
	res.send("GraphQL API rodando");
});

export default app;