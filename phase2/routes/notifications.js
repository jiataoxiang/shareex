const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const {ObjectID} = require("mongodb");

// return all notifications that one user received.
router.get('/receiver/:id', (req, res) => {
    Notification.find({to: req.params.id}).then(msgs => {
        let toReturn = [];
        msgs.forEach(msg => {
            User.findById(msg.from).then(sender => {
                if (!sender) {
                    toReturn.push({
                        _user_id: null,
                        admin: false,
                        avatar: null,
                        nickname: null,
                        _noti_id: msg._id,
                        body: msg.body,
                        link: msg.link,
                        type: msg.type,
                        time: msg.created_at,
                        read: msg.read
                    })
                } else {
                    toReturn.push({
                        _user_id: sender._id,
                        admin: sender.admin,
                        avatar: sender.avatar,
                        nickname: sender.name,
                        _noti_id: msg._id,
                        body: msg.body,
                        link: msg.link,
                        type: msg.type,
                        time: msg.created_at,
                        read: msg.read
                    })
                }
                
                if (msg === msgs[msgs.length - 1]) {
                    res.send(toReturn);
                } 
            })
        })
        
    }).catch(err => {
        res.status(500).send(err);
    });
});

// check off all unread notifications of one user.
router.post('/read/:id', (req, res) => {
    Notification.updateMany({to: req.params.id, read: false}, 
                            {"$set":{"read": true}}).then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send(err);
    });
});

module.exports = router;
