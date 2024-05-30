const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Player = require("./models/player.model.js")
const PORT = 9000;
require('dotenv').config();
const DB_URL = process.env.DB_URL;

app.use(express.json())

async function connectDB() {
    await mongoose.connect(DB_URL)
}

connectDB()
    .then(() => {
        console.log("db connection successful.")
    })
    .catch(() => {
        console.log("db connection unsuccessful.")
    })

// http://localhost:9000/
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} for connections(for req/resp)`);
});

app.get('/', async(req, res) => {
    console.log("GET request received.");
    const players = await Player.find()
    res.send(players);
});

app.get('/:id', async(req,res) => {
    try{
        console.log("GET request received.");
        const players = await Player.findById(req.params.id)
        res.json(players)
    }catch(err){
        res.send(`GET error ${err}`)
    }
})

app.post('/', async(req, res) => {
    console.log("POST request received.");
    try {
        const player = await Player.create(req.body);
        res.json(player);
    } catch(err) {
        console.log("POST error: ", err);
        res.send("POST error")
    }
});

app.patch('/:id', async(req,res)=> {
    console.log(`PATCH request received on ${req.params.id}`);
    try{
        const player = await Player.findById(req.params.id) 
        player.score = req.body.score
        const p1 = await player.save()
        res.json(p1)   
    }catch(err){
        res.send('PATCH Error')
    }
})

app.delete('/', (req, res) => {
    console.log("DELETE request received");
    res.send("DELETE request")
})