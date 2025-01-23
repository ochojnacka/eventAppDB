const User = require('../models/user');
const Ticket = require('../models/ticket');

exports.createTicket = (req, res, next) => {
    const newTicket = new Ticket({
        eventId: req.body.eventId,
        price: req.body.price
    });

    if (!req.body.eventId || !req.body.price) {
        return res.status(400).json({
            message: "Wymagane jest pole eventId oraz price"
        });
    }
    
    newTicket.save()
        .then(result => {
            res.status(201).json({
                message: "Bilet został utworzony",
                data: result
            });
        })
        .catch(error => {
            res.status(500).json({ 
                message: "Błąd podczas tworzenia biletu", 
                error: error.message 
            });
        });
};

exports.getAllTickets = (req, res, next) => {
    Ticket.find()
        .then(tickets => {
            res.status(200).json({
                message: "Lista wszystkich biletów:",
                list: tickets
            });
        })
        .catch(error => {
            res.status(500).json({ 
                message: error 
            });
        });
};

exports.getTicketById = (req, res, next) => {
    const id = req.params.ticketId;

    Ticket.findById(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ 
                    message: "Nie znaleziono biletu" 
                });
            }
            res.status(200).json({
                message: "Szczegóły biletu nr. " + id,
                data: result
            });
        })
        .catch(error => {
            res.status(500).json({ 
                message: "Błąd podczas pobierania biletu", 
                error: error.message 
            });
        });
};

exports.updateTicket = (req, res, next) => {
    const id = req.params.ticketId;

    Ticket.findByIdAndUpdate(
        id, 
        {
            price: req.body.price 
        })
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: "Nie znaleziono biletu" });
            }

            res.status(200).json({
                message: "Bilet został zaktualizowany"
            });
        })
        .catch(error => {
            res.status(500).json({ 
                message: "Błąd podczas aktualizacji biletu", 
                error: error.message 
            });
        });
};

exports.deleteTicket = (req, res, next) => {
    const id = req.params.ticketId;

    Ticket.findByIdAndDelete(id)
        .then(ticket => {
            if (!ticket) {
                return res.status(404).json({ 
                    message: "Nie znaleziono biletu" 
                });
            }

            User.updateMany(
                { tickets: id },
                { $pull: { tickets: id } }
            )
            .then(result => {
                res.status(200).json({
                    message: "Bilet został usunięty, a użytkownicy zostali zaktualizowani"
                });
            })
            .catch(error => {
                res.status(500).json({
                    message: "Błąd podczas aktualizowania użytkowników",
                    error: error.message
                });
            });

        })
        .catch(error => {
            res.status(500).json({ 
                message: "Błąd podczas usuwania biletu", 
                error: error.message 
            });
        });
};

exports.assignTicketToUsers = (req, res) => {
    const ticketId = req.body.ticketId;
    const userIds = req.body.userIds;

    if (!ticketId || !userIds || userIds.length === 0) {
        return res.status(400).json({ message: "ticketId i userIds są wymagane" });
    }

    User.find({ _id: { $in: userIds } })
        .then(users => {
            if (users.length !== userIds.length) {
                return res.status(404).json({ message: "Przynajmniej jedno z podanych ID użytkowników jest nieprawidłowe" });
            }

            Ticket.findById(ticketId)
                .then(ticket => {
                    if (!ticket) {
                        return res.status(404).json({ message: "Bilet o podanym ID nie istnieje" });
                    }

                    User.updateMany(
                        { _id: { $in: userIds } },
                        { $addToSet: { tickets: ticketId } }
                    )
                    .then(result => {
                        res.status(200).json({ message: "Bilet został przypisany do użytkowników" });
                    })
                    .catch(error => {
                        res.status(500).json({ message: "Błąd podczas przypisywania biletu", error: error.message });
                    });
                })
                .catch(error => {
                    res.status(500).json({ message: "Błąd przy wyszukiwaniu biletu", error: error.message });
                });
        })
        .catch(error => {
            res.status(500).json({ message: "Błąd przy sprawdzaniu użytkowników", error: error.message });
        });
};