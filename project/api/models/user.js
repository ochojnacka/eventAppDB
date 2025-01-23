const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }] // zagnieżdżone bilety
}, { versionKey: false });

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        bcrypt.hash(this.password, 10, (error, hashedPassword) => {
            if (error) {
                return next(error);
            }

            this.password = hashedPassword;
            next();
        });
    } else {
        next();
    }
});

module.exports = mongoose.model('User', userSchema);