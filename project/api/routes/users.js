const express = require("express");
const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/', UsersController.getAllUsers);
router.get("/:userId", UsersController.getUserById);

router.get('/:userId/tickets', UsersController.getUserDetailsWithTickets);

router.post('/signup', UsersController.userSignup);
router.post('/login', UsersController.userLogin);
router.delete('/delete-account', UsersController.userDeleteAcc);


module.exports = router;