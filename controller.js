require("dotenv").config();
const mysql = require("mysql2");
const mysql_import = require("mysql-import");
const fs = require("fs");
const chatType = 1;
const dbConfig = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE
};
const dbInit = async () => {
	try {
		const db = await mysql.createConnection(dbConfig);
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
	let config = Object.assign(dbConfig, { onerror: err => console.log(err.message) });
	const mydb_importer = mysql_import.config(config);
	// await mydb_importer.import('mydb.sql');
	await mydb_importer.import("chat.sql");
	return true;
};

const dbCreate = async data => {
	try {
		const db = await dbInit();
		await db.execute(
			`INSERT INTO chat(chatType,gameId,userId,userMessage) VALUES(${chatType},${
				data.gameId
			},"${data.userId}",${db.escape(data.message)})`,
			(err, results, fields) => {
				return results;
			}
		);
	} catch (e) {
		console.log("Error:", e);
	}
};

// ?APIs
// todo: Fetch All Messages;
const dbFetchAllMessages = async (req, res) => {
	try {
		const db = await dbInit();
		await db.execute(`SELECT userId,userName,userMessage FROM chat`, (err, results, fields) => {
			if (err)
				res.status(400).send({
					status: false,
					code: 400,
					data: err
				});

			res.status(200).json({
				status: true,
				code: 200,
				data: results.map(item => {
					return {
						userId: item.userId,
						name: item.userName,
						message: item.userMessage
					};
				})
			});
		});
	} catch (e) {
		return e;
	}
};

// todo: Fetch Message By User Id;
const dbGetMessageById = async (req, res) => {
	try {
		const db = await dbInit();
		await db.execute(
			`SELECT userId,userName,userMessage FROM chat WHERE chatId = ${req.params.userId}`,
			(err, results, fields) => {
				if (err) res.status(502).send(err);
				res.status(200).json(
					results.map(item => {
						return {
							userId: item.userId,
							name: item.userName,
							message: item.userMessage
						};
					})
				);
			}
		);
	} catch (e) {
		return e;
	}
};

// Exporting functions.
module.exports = {
	dbUpdate,
	dbCreate,
	dbFetchAllMessages,
	dbGetMessageById
};
