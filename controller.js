require("dotenv").config();
const mysql = require("mysql2");
const mysql_import = require("mysql-import");
const fs = require("fs");
const chatType = 1;

const dbInit = async () => {
	try {
		const db = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		db.on("error", function(err) {
			console.log(
				"Error:",
				"Database not connected properly, check .env file for setting up database configuration."
			);
		});
		db.connect(err => {
			console.log("Success:", "Database connected!");
		});
		return db;
	} catch (e) {
		throw new Error(e);
	}
};

const dbUpdate = async data => {
	const mydb_importer = mysql_import.config({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_DATABASE,
		onerror: err => console.log(err.message)
	});
	// await mydb_importer.import('mydb.sql');
	await mydb_importer.import("chat.sql");
};

const dbCreate = async data => {
	try {
		const db = await dbInit();
		await db.execute(
			`INSERT INTO chat(chatType,gameId,userId,userMessage) VALUES(${chatType},${data.gameId},"${data.userId}","${data.message}")`,
			(err, results, fields) => {
				return results;
			}
		);
	} catch (e) {
		console.log("Error:", e);
	}
};

// Exporting functions.
module.exports = {
	dbUpdate,
	dbCreate
};
