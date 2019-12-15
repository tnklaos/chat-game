const jwt = require("jsonwebtoken");
const secretKey = "fcukingsecretkeyisawesome";

exports.verify = (req, res, next) => {
	let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
	if (token.startsWith("Bearer ")) {
		// Remove Bearer from string
		token = token.slice(7, token.length);
	}

	if (token) {
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				return res.json({
					success: false,
					message: "Token is not valid"
				});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.json({
			success: false,
			message: "Auth token is not supplied"
		});
	}
	// console.log(res);
	// console.log(next);
	// if (req.headers["authorization"]) {
	// 	try {
	// 		let authorization = req.headers["authorization"].split(" ");
	// 		if (authorization[0] !== "Bearer") {
	// 			return res.status(401).send();
	// 		} else {
	// 			req.jwt = "verified-token-123";
	// 			// req.jwt = jwt.verify(authorization[1], secret);
	// 			return next();
	// 		}
	// 	} catch (err) {
	// 		return res.status(403).send();
	// 	}
	// } else {
	// 	return res.status(401).send();
	// }
};
