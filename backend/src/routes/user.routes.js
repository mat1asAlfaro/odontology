const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/admins", userController.createAdmin);
router.post("/dentists", userController.createDentist);
router.post("/patients", userController.createPatient);

module.exports = router;
