import express from "express"
import { getAllNotes } from "../controllers/notesController.js";
import { getNoteById } from "../controllers/notesController.js";
import { createNotes } from "../controllers/notesController.js";
import { updateNotes } from "../controllers/notesController.js";
import { deleteNotes } from "../controllers/notesController.js";

const router = express.Router();

//Get Method
router.get("/", getAllNotes);

//Get Single Note by ID
router.get("/:id", getNoteById);

//Post Method
router.post("/", createNotes);

//Put Method
router.put("/:id", updateNotes)

//Delete Method
router.delete("/:id", deleteNotes)

export default router;