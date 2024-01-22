var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let cors = require("cors");
let { randomUUID } = require("crypto");

//
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let users = [];

app.get("/users", (req, res) => {
 
    res.json(users);
})

app.get("/users/:id", (req, res) => {

    let id = req.params.id;

    let user = users.find(user => user.id == id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({message: "Ingen sådan användare"});
    }
});

app.post("/users", (req, res) => {

    console.log(req.body);

    let user = {
        id: randomUUID(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    users.push(user);

    res.json(user);
})



app.delete("/users/:id",(req, res) => {
    let id = req.params.id;
    console.log("id", id);

    users = users.filter(user => user.id != id);
    console.log("users efter delete", users);

    res.json({message: "radera endpoint"})
})

app.post("/login", (req, res) => {

    let checkEmail = req.body.email;
    let checkPassword = req.body.password;

    let user = users.find(user => user.email == checkEmail && user.password == checkPassword);

    if (user) {
        res.json({user: user.id});
    } else {
        res.status(401).json({message: "Fel inlogg"});
    }
})




module.exports = app;
