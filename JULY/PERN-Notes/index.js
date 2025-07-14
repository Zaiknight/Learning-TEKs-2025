import express, { json } from "express";
import cors from "cors";
import { Client } from "pg";

const app = express();

const pool = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password:"Zain1234",
    database:"notes"
});

pool.connect().then(() => console.log("Connected"))

//Middleware and dependencies
app.use(cors());
app.use (express.json())
//ROUTES...

//Create note
app.post("/notes", async(req,res) =>{
    try{
        const {content,title} = req.body;
        const insertQuery ='INSERT INTO notes (content,title) VALUES($1,$2) RETURNING *';

        await pool.query(insertQuery,[content,title]);
        res.send("POSTED DATA");
        console.log(result);
    }catch(err){
        res.send(err);
        console.log(err.message);
    }
})

//GET all notes
app.get("/notes", async (req,res)=> {
    try {
        const allNotes = await pool.query("SELECT * FROM notes");
        res.json(allNotes.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//get a note
app.get("/notes/:id", async (req,res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const note = await pool.query("SELECT * FROM notes WHERE note_id = $1", [id]);

        res.json(note.rows);

    } catch (err) {
        console.error(err.message);
    }
})
//update a note
app.put("/notes/:id", async (req,res)=> {
    try {
        const {id} = req.params;
        const {content,title} = req.body;

        const updateNote = await pool.query("UPDATE notes SET content = $1, title = $2 WHERE note_id = $3", [content,title,id]);
        res.json(updateNote.rows)
    } catch (err) {
        console.error(err.message);
    }
})

//delete a note
app.delete("/notes/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const deleteNote = await pool.query("DELETE FROM notes WHERE note_id = $1",[id]);
        res.json("DELETED");
    } catch (err) {
        console.log(err.message);
    }
})

app.listen(5000, ()=>{
    console.log("Server is connected on port 5000....")
})