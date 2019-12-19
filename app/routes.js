const ValidationMiddleware = require("./middleware");
const Controller = require("../controller");

const path = require("path");

exports.routesConfig = function(app) {
	app.get("/", function(req, res) {
		res.sendFile("index.html", {
			root: path.join(__dirname, "../")
		});
	});
	app.route("/messages").get(Controller.dbFetchAllMessages);
	app.route("/message/:userId").get(Controller.dbGetMessageById);
};
