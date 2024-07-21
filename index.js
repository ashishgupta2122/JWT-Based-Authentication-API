const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API!" });
})

app.post("/login", (req, res) => {
    const user = {
        username: "ashish",
        email: "xyz@gmail.com"
    }
    jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
        res.json({
            token: token,
        })
    })
})

app.post("/profile", verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            return res.status(403).json({ result: "Invalid token" });
        } else {
            return res.json({
                result: "Profile accessed",
                user: authData.user
            });
        }
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.send({
            result: 'Token is not valid'
        })
    }
}

app.listen(4000, (req, res) => {
    console.log("Server running on port 4000");
})