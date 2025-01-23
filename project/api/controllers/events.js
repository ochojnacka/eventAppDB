const mongoose = require("mongoose");
const Event = require('../models/event');
const User = require('../models/user');
const Ticket = require('../models/ticket');
const Notification = require('../models/notification');

exports.getAllEvents = (req, res, next) => {
    Event.find()
    .then(events => {
            res.status(200).json({
                message: "Lista wszystkich eventów:",
                list: events
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error
            });
        })
    }

exports.getEventById = (req, res, next) => {
        const id = req.params.eventId;

        if(!id) {
            return res.status(404).json({
                message: "Nie podano identyfikatora wydarzenia"
            });
        }
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Niepoprawny identyfikator wydarzenia"
            });
        }
        
        Event.findById(id)
            .then(result => {
                if (!result) {
                    return res.status(404).json({
                        message: "Nie znaleziono wydarzenia"
                    });
                }

                res.status(200).json({
                    message: "Szczegóły wydarzenia nr." + id,
                    data: result
                });
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych wydarzenia', error);
                res.status(500).json({
                    message: "Wystąpił błąd podczas pobierania danych wydarzenia",
                    error: error.message
                });
            });
        
    };

exports.createEvent = (req, res, next) => {
    const { title, location, date, categories } = req.body;

    if (!title || !location || !date) {
        return res.status(400).json({
            message: "Wszystkie pola (title, location, date) są wymagane",
        });
    }

    const processedCategories = Array.isArray(categories)
        ? categories.map(category => ({
            name: category.name
        }))
        : [];

    const newEvent = new Event({
        title,
        location,
        date,
        categories: processedCategories,
    });

    newEvent.save()
        .then(result => {
            res.status(201).json({
                message: "Utworzono nowy Event",
                data: result,
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Błąd podczas tworzenia wydarzenia",
                error: error.message,
            });
        });
    };

exports.updateEvent = (req, res, next) => {
    const id = req.params.eventId;

    Event.findByIdAndUpdate(
            id, 
            {
                title: req.body.title,
                location: req.body.location,
                date: req.body.date,
                categories: req.body.categories.map(category => ({
                name: category.name
                }))
            }
        )
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    alert: "Nie znaleziono wydarzenia nr." + id
                });
            }

            res.status(200).json({
                message: "Dane wydarzenia nr." + id + " zostały zaktualizowane"
            });
        })
        .catch(error => {
            console.error('Błąd podczas aktualizacji wydarzenia', error);
            res.status(500).json({
                message: "Wystąpił błąd podczas aktualizacji danych wydarzenia",
                error: error.message
            });
        });
};

exports.deleteEvent = (req, res, next) => {
    const id = req.params.eventId;

    if (!id) {
        return res.status(400).json({
            message: "Nie podano identyfikatora wydarzenia"
        });
    }

    Event.findByIdAndDelete(id)
        .then(event => {
            if (!event) {
                return res.status(404).json({
                    message: "Nie znaleziono wydarzenia o podanym ID"
                });
            }

            Ticket.find({ eventId: id })
                .then(tickets => {
                    const ticketIds = tickets.map(ticket => ticket._id);

                    Ticket.deleteMany({ eventId: id })
                        .then(() => {
                            User.updateMany(
                                { tickets: { $in: ticketIds } },
                                { $pull: { tickets: { $in: ticketIds } } }
                            )
                            .then(() => {
                                Notification.deleteMany({ "messages.eventId": id })
                                    .then(() => {
                                        res.status(200).json({
                                            message: "Wydarzenie, powiązane bilety i powiadomienia zostały usunięte",
                                        });
                                    })
                                    .catch(error => {
                                        console.error("Błąd podczas usuwania powiadomień:", error);
                                        res.status(500).json({
                                            message: "Błąd podczas usuwania powiązanych powiadomień",
                                            error: error.message,
                                        });
                                    });
                            })
                            .catch(error => {
                                console.error("Błąd podczas aktualizowania użytkowników:", error);
                                res.status(500).json({
                                    message: "Błąd podczas aktualizowania użytkowników",
                                    error: error.message,
                                });
                            });
                        })
                        .catch(error => {
                            console.error("Błąd podczas usuwania biletów:", error);
                            res.status(500).json({
                                message: "Błąd podczas usuwania biletów",
                                error: error.message,
                            });
                        });
                })
                .catch(error => {
                    console.error("Błąd podczas wyszukiwania biletów:", error);
                    res.status(500).json({
                        message: "Błąd podczas wyszukiwania biletów",
                        error: error.message,
                    });
                });
        })
        .catch(error => {
            console.error("Błąd podczas usuwania wydarzenia:", error);
            res.status(500).json({
                message: "Błąd podczas usuwania wydarzenia",
                error: error.message,
            });
        });
};

// aggregate
exports.countEventsByCategory = (req, res) => {
    console.log("Wywołano kontroler countEventsByCategory");
    Event.aggregate([
        { $unwind: "$categories" },
        { $group: { _id: "$categories.name", eventCount: { $sum: 1 } } },
        { $sort: { eventCount: -1 } }
    ])
    .then(result => {
        console.log("Wynik agregacji:", result);
        res.status(200).json(result);
    })
    .catch(error => {
        console.error("Błąd w kontrolerze countEventsByCategory:", error);
        res.status(500).json({ message: error.message });
    });
};
