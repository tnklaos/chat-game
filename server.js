const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const router = require("./app/routes");
const user = {};
const { dbCreate, dbUpdate } = require("./controller");

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,PATCH,DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
	next();
});

// CORS Config
const corsOptions = {
	origin: "*",
	withCredentials: true
};
app.use(cors(corsOptions));

// Body
app.use(bodyParser.json());
router.routesConfig(app);

// Connection Establishing

io.on("connection", function(socket) {
	if (process.argv[2] == "update_database") {
		dbUpdate();
	} else {
		let randomUserId = Math.random()
			.toString(36)
			.substring(7);
		user[socket.id] = {
			userId: randomUserId,
			message: "Gaming Chat: Welcome to the chat."
		};
		console.log("A user '" + user[socket.id].userId + "' connected");
		socket.send(user[socket.id]);
		socket.emit("testerEvent", "Test emit from server.");

		socket.on("disconnect", function() {
			console.log("A user disconnected");
		});
		// Receiveing Messages
		socket.on("send-message", function(message) {
			dbCreate(message);
			socket.broadcast.emit("received", {
				message: message.message
			});
		});
		// Typing notification
		socket.on("typing", data => {
			socket.broadcast.emit("notifyTyping", { message: data.message });
		});
		socket.on("stopTyping", () => {
			socket.broadcast.emit("notifyTyping", { message: "" });
		});
	}
});

// Server Output
http.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
