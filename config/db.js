import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_URL);
		console.log("Banco conectado");
	} catch (error) {
		console.error("Erro ao conectar no banco", error);
		process.exit(1);
	}
};

export default connectDB;