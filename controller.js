const mysql = require("mysql2");
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	database: "db_stockadmin"
});
const chatType = 1;

const dbCreate = data => {
	try {
		connection.execute(
			`INSERT INTO chat(chatType,gameId,userId,userMessage) VALUES(${chatType},${data.gameId},"${data.userId}","${data.message}")`,
			function(err, results, fields) {
				console.log(results); // results contains rows returned by server
				console.log(fields); // fields contains extra meta data about results, if available
			}
		);
	} catch (e) {
		console.log(e);
	}
};

module.exports = {
	dbCreate
};
