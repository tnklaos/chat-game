const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const router = require("./app/routes");
const user = {};
const { dbCreate, dbUpdate } = require("./controller");

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,PATCH,DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
	next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
	let randomUserId = Math.random()
		.toString(36)
		.substring(7);
	user[socket.id] = {
		userId: randomUserId,
		message: "Gaming Chat: Welcome to the chat."
	};
	console.log("A user '" + user[socket.id].userId + "' connected");
	socket.send(user[socket.id]);
	socket.emit("chat-game", "Client is connected.");

	socket.on("disconnect", function() {
		console.log("A user disconnected");
	});
	// Receiveing Messages
	socket.on("send-message-game", function(message) {
		console.log(message);
		dbCreate(message);
		socket.emit("new-message-game", message);
	});
	// Typing notification
	socket.on("typing", data => {
		socket.broadcast.emit("notifyTyping", { message: data.message });
	});
	socket.on("stopTyping", () => {
		socket.broadcast.emit("notifyTyping", { message: "" });
	});
	socket.on("getAllMessages", data => {
		socket.emit("getAllMessages", "okay");
	});
});

// Server Output
http.listen(PORT, () => {
	if (process.argv[2] == "update_database") {
		console.log("Updating database...");
		if (dbUpdate()) {
			console.log("Database update completed.");
		}
	}
	console.log(`Server is running on port: ${PORT}`);
});
