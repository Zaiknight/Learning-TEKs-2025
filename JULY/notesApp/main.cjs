const {Client} = require('pg')
const express = require('express')

const app = express()
app.use(express.json());

const connection = new Client({
    host:"localhost",
    user: "postgres",
    port: 5432,
    password: "Zain1234",
    database: "notes"
})

connection.connect().then(()=> console.log("Connected"))

app.post('/postData',(req,res) => {
    const {content,title} = req.body

    const insert_query = `INSERT INTO notes (content,title) VALUES ($1,$2)`

    connection.query(insert_query,[content,title],(err,result)=>{
        if(err){
            res.send(err)
        }else{
            console.log(result)
            res.send("POSTED DATA")
        }
    })
})

app.get('/fetchData', (req,res) => {
    const fetch_query = "SELECT * FROM notes"
    connection.query(fetch_query,(err,result) => {
        if(err){
            res.send(err)
        }else{
            console.log(result)
            res.send(result.rows)
            res.send("FETCHED DATA")
        }
    })
})

app.listen(3000,()=>{
    console.log("server is running.....")
})