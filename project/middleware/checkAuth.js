const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    console.log("Middleware checkAuth uruchomione");

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Brak tokenu autoryzacyjnego."
        });
    }

    // token jest w formacie: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token nieprawidłowy."
        });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Błąd autoryzacji, token niepoprawny."
            });
        }

        req.user = decoded;
        next();
    });
};
