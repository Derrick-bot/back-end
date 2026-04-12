import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const context = async ({ req }) => {
	const auth = req.headers.authorization || "";

	if (!auth) return { user: null };

	try {
		const token = auth.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.id);

		return { user };
	} catch {
		return { user: null };
	}
};