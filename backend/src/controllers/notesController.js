import Notes from "../models/Notes.js";

export async function getAllNotes(req,res) {
    //res.status(200).send("Get all notes"); // Fetched all notes.

    try {
        const notes = await Notes.find();
        res.status(200).json(notes); //200 means Working Successfully!!
    } catch (error) {
        console.error("Error in getting all notes,",error);
        res.status(500).json({ message : "Internal Server Error!!" }); //500 means Internal Server Error!!
    }
}

export async function getNoteById(req, res) {
    try {
        const note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found!!" });
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getting note by ID:", error);
        res.status(500).json({ message: "Internal Server Error!!" });
    }
}

export async function createNotes(req,res) {
    //res.status(201).json("Note created successfully."); //201 means Created Successfully!!

    try {
        const { title, content } = req.body;
        const newNote = new Notes({ title, content });

        await newNote.save();
        res.status(201).json({ message : "New note created successfully!!" });
    } catch (error) {
        console.error("Error in creating new note",error);
        res.status(500).json({ message : "Internal Server Error!!" });
    }
}

export async function updateNotes(req,res) {
    //res.status(200).json("Note updated successfully."); //200 means Working Successfully!!

    try {
        const { title, content } = req.body;
        const updateNote = await Notes.findByIdAndUpdate (
            req.params.id, { title,content }, { new : true }
        );
        if(!updateNote) return res.status(404).json({ message : "Note not found!!" });
        res.status(200).json({ message : "Note updated successfully!!" });
    } catch (error) {
        console.error("Error in updating the note!!",error);
        res.status(500).json({ message : "Internal Server Error!!" });
    }
}

export async function deleteNotes(req,res) {
    //res.status(200).json("Note deleted successfully."); //200 means Working Successfully!!

    try {
        const deleteNote = await Notes.findByIdAndDelete(req.params.id);
        if(!deleteNote) return res.status(404).json({ message : "Note not found!!" });

        res.status(200).json({ message : "Note deleted sucessfully!!" });
    } catch (error) {
        console.error("Error in deleting the note",error);
        res.status(500).json({ message : "Internal Server Error!!" });
    }
}