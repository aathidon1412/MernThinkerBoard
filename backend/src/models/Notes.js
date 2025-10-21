import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title : { type : String,required : true },
        content : { type : String,required : true }
    },
    { timestamps : true }
);

const Notes = mongoose.model("Note",noteSchema);

export default Notes;