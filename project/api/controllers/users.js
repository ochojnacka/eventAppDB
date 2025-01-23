const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/user');

exports.userSignup = (req, res, next) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({
            message: "Wszystkie dane są wymagane",
        });
    }

    console.log(`Sprawdzam, czy użytkownik z email ${email} już istnieje...`);
    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({
                    message: "Użytkownik z tym adresem e-mail już istnieje",
                });
            }

            console.log("Tworzę nowego użytkownika...");
            const user = new User({
                email: email,
                name: name,
                password: password,
            });

            console.log("Zapisuję użytkownika...");
            user.save()
                .then(() => {
                    res.status(201).json({
                        message: "Utworzono nowego użytkownika",
                    });
                })
                .catch(error => {
                    console.error("Błąd podczas zapisywania użytkownika:", error);
                    res.status(500).json({
                        message: "Błąd podczas tworzenia użytkownika",
                        error: error.message,
                    });
                });
        })
        .catch(error => {
            console.error("Błąd podczas sprawdzania użytkownika:", error);
            res.status(500).json({
                message: "Błąd podczas sprawdzania użytkownika: " + error.message,
            });
        });
};

exports.userLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email i hasło są wymagane",
        });
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "Użytkownik o takim adresie email nie istnieje",
                });
            }

            bcrypt.compare(password, user.password, (error, isMatch) => {
                if (error) {
                    return res.status(500).json({
                        message: "Błąd podczas porównania hasła",
                    });
                }

                if (!isMatch) {
                    return res.status(401).json({
                        message: "Nieprawidłowe hasło",
                    });
                }

                const token = jwt.sign(
                    { userId: user._id, email: user.email },
                    process.env.JWT_KEY,
                    { expiresIn: "14d", algorithm: 'HS256' }
                );

                console.log("Zalogowano: " + user.name)
                res.status(200).json({
                    message: "Zalogowano pomyślnie",
                    token: token
                });
            });
        })
        .catch(err => {
            console.error("Błąd podczas logowania:", err);
            res.status(500).json({
                message: "Wystąpił błąd serwera",
            });
        });
};

exports.userDeleteAcc = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({
            message: "Wszystkie pola (email, password, confirmPassword) są wymagane",
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            message: "Hasła nie są zgodne - Spróbuj ponownie",
        });
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "Użytkownik o takim adresie email nie istnieje",
                });
            }

            return bcrypt.compare(password, user.password).then(isPasswordValid => {
                if (!isPasswordValid) {
                    return res.status(401).json({
                        message: "Nieprawidłowe hasło - Usunięcie konta nie powiodło się",
                    });
                }

                return User.deleteOne({ email }).then(() => {
                    res.status(200).json({
                        message: "Konto zostało usunięte",
                    });
                });
            });
        })
        .catch(error => {
            console.error("Błąd podczas usuwania konta:", error.message);
            res.status(500).json({
                message: "Wystąpił błąd serwera - Spróbuj ponownie później",
            });
        });
};

exports.getAllUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json({
                message: "Lista wszystkich użytkowników:",
                list: users
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Błąd serwera",
                error: error.message
            });
        });
};

exports.getUserById = (req, res, next) => {
        const id = req.params.userId;
        
        if(!User) {
            return res.status(404).json({
                message: "Nie znaleziono"
            });
        }

        User.findById(id)
            .then(result => {
                res.status(200).json({
                    message: `Dane użytkownika ${result.name}`,
                    data: result
                });
            })
            .catch(error => {
                console.error('Błąd pobierania danych użytkownika', error);
                res.status(500).json({
                    message: "Błąd podczas pobierania danych użytkownika",
                    error: error.message
                });
            });
        
};

// populate
exports.getUserDetailsWithTickets = (req, res, next) => {
    User.findById(req.params.userId)
        .populate({
            path: 'tickets',
            populate: { path: 'eventId', select: 'title location date' }
        })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "Nie znaleziono użytkownika" });
            }

            res.status(200).json({
                message: `Szczegóły użytkownika: ${user.name}`,
                user: {
                    name: user.name,
                    email: user.email,
                    tickets: user.tickets.map(ticket => ({
                        ticketId: ticket._id,
                        price: ticket.price,
                        event: ticket.eventId ? {
                            title: ticket.eventId.title,
                            location: ticket.eventId.location,
                            date: ticket.eventId.date
                        } : null
                    }))
                }
            });
        })
        .catch(error => {
            console.error("Błąd podczas pobierania danych użytkownika:", error);
            res.status(500).json({ message: "Wystąpił błąd", error: error.message });
        });
};
