const ValidationMiddleware = require("./middleware");
const path = require("path");

exports.routesConfig = function(app) {
	app.get("/", function(req, res) {
		res.sendFile("index.html", {
			root: path.join(__dirname, "../")
		});
	});
};
