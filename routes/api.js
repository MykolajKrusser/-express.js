const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const db = 'mongodb://userNicolas:userNicolas@ds229909.mlab.com:29909/eventsbd';
mongoose.connect(db, err =>{
    if(err){
        console.error('ERROR!' + err);
    } else{
        console.log('Connected to MongoDB');
    };
});
function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorazid request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null'){
        return res.status(401).send('Unauthorazid request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if (!payload){
        return res.status(401).send('Unauthorazid request')
    }
    req.userId = payload.subject
    next()
};
router.get('/', (req, res) => {
    res.send('API router LIVE!!!');
});
router.post('/register', (req, res) => {
    let userData = req.body;
    let user = new User(userData);
    user.save((error, registeredUser)=>{
        if(error){
            console.log(error);
        }else{
            let payload = {subject: registeredUser._id};
            let token = jwt.sign(payload, 'secretKey');
            res.status(200).send({token});
        };
    });
});
router.post('/login', (req, res) => {
    let userData = req.body;
    User.findOne({email: userData.email}, (error, user)=>{
        if(error){
            console.log(error);
        }else{
            if(!user){
                res.status(401).send('Invalid email')
            }else if(user.password !== userData.password){
                res.status(401).send('Invalid password')
            }else{
                let payload = {subject: user._id};
                let token = jwt.sign(payload, 'secretKey');
                res.status(200).send({token})
            };
        };
    });
});
router.get('/events', (req, res) => {
    let events = [
        {
            "_id": "1",
            "name": "JSmeet in New York",
            "description": "meet JS developers",
            "date": "2019-11-12T12:00:00.511Z"
        },
        {
            "_id": "2",
            "name": "Java Conf in New Dali",
            "description": "conference of anonymous programmers",
            "date": "2018-05-14T10:30:00.511Z"
        },
        {
            "_id": "3",
            "name": "Php Famous Leaders devcon",
            "description": "Well, you understand",
            "date": "2018-10-22T24:00:00.511Z"
        },
        {
            "_id": "4",
            "name": "Bearded conference JavaScrip in Real World",
            "description": "this is not barbershop",
            "date": "2018-11-23T10:30:00.511Z"
        },
        {
            "_id": "5",
            "name": "Fight Angular vs React",
            "description": "measure popularity",
            "date": "2018-04-11T10:30:00.511Z"
        },
        {
            "_id": "6",
            "name": "AnimeChannel?",
            "description": "How do I patch KDE2 under FreeBSD?",
            "date": "2022-12-31T24:00:00.511Z"
        }
    ];
    res.json(events);
});
router.get('/special', verifyToken, (req, res) => {
    let events = [
        {
            "_id": "1",
            "name": "Serious Summit",
            "description": "for the bearded",
            "date": "2018-01-01T10:30:00.511Z"
        },
        {
            "_id": "2",
            "name": "How to become a programmer",
            "description": "free course about everything in the world",
            "date": "2012-04-23T10:30:00.511Z"
        },
        {
            "_id": "3",
            "name": "Oops!",
            "description": "support group for newcomers in nuclear physics",
            "date": "2045-05-09T10:30:00.511Z"
        },
        {
            "_id": "4",
            "name": "Meat Coding",
            "description": "write an application at a meat processing plant",
            "date": "2012-04-23T10:30:00.511Z"
        },
        {
            "_id": "5",
            "name": "Java Scrips in Atlantis",
            "description": "what's new?",
            "date": "2012-04-23T10:30:00.511Z"
        },
        {
            "_id": "6",
            "name": "another meeting",
            "description": "some topic",
            "date": "2019-19-19T10:30:00.511Z"
        }
    ];
    res.json(events);
});

module.exports = router;