import express from "express"
import notesRoutes from "./routes/notesRoutes.js"
import connectDB from "./config/db.js"
import dotenv from "dotenv"
import cors from "cors" //Cross Origin Resource Sharing
import rateLimiter from "./middleware/rateLimiter.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if(process.env.NODE_ENV !== "production"){
    app.use(cors(
        {
            origin : "http://localhost:5173",
        }
    ));
}
app.use(express.json()); //Middleware
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
    });
}

//Connecting to DataBase
connectDB().then(()=>{
    //Listening to the server
    app.listen(PORT, ()=>{
        console.log("Server started!! at PORT:", PORT);
    });
});