const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { isAuth, isAuthorizedUser } = require('../middleware/auth');
const {ObjectID} = require("mongodb");

// return all notifications that one user received.
router.get('/receiver/:id', isAuth, (req, res) => {
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
                        username: null,
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
                        username: sender.username,
                        _noti_id: msg._id,
                        body: msg.body,
                        link: msg.link,
                        type: msg.type,
                        time: msg.created_at,
                        read: msg.read
                    })
                }
                
                if (toReturn.length === msgs.length) {
                    res.send(toReturn);
                } 
            })
        })
        
    }).catch(err => {
        res.status(500).send(err);
    });
});

// check off all unread notifications of one user.
router.post('/read/:id', isAuth, (req, res) => {
    Notification.updateMany({to: req.params.id, read: false}, 
                            {"$set":{"read": true}}).then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// create a notification.
// required: from, to, body
router.post('/create', isAuth, (req, res) => {
    if (!req.body.from || !req.body.to || !req.body.body) {
        return res.status(400).send();
    } else if (!ObjectID.isValid(req.body.from) || !ObjectID.isValid(req.body.to)) {
        return res.status(400).send();
    } else {
        Notification.create(req.body).then(msg => {
            console.log("notification create: ", msg);
            msg.save().then(msg => {
                res.send(msg);
            })
        }).catch(err => {
            res.status(500).send(err);
        })
    }
});

router.post("/to-admin", isAuth, (req, res) => {
   const sender = req.body.from;
   const content = req.body.body;
   User.find({}).then(users => {
       const admins = users.filter(user => user.admin === true)
       admins.forEach(admin => {
           const to = admin._id;
          const new_msg = {
               from : sender,
               to: to,
               body: content,
               link: req.body.link
           };
           Notification.create(new_msg).then(msg => {
               console.log("notification create: ", msg);
               msg.save().then(msg => {
                   res.send(msg);
               })
           }).catch(err => {
               res.status(500).send(err);
           })
       })
   })

});

router.delete('/:id', isAuth, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
        res.status(404).send();
  }
    
  Notification.findById(req.params.id).then(msg => {
      if (!msg) {
          res.status(400).send();
      } else {
          msg.remove().then(result => {
              res.send(result);
          })
      }
  }).catch(err => {
      console.log(err);
  });
});

module.exports = router;
