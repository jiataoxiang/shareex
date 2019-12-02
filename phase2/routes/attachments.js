const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const Attachment = require('../models/Attachment');
const { isAuth, isAuthorizedPost, isAdmin } = require('../middleware/auth');

// delete all attachments of a post
router.delete('/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(404).send('attachment id not valid');
  }

  Attachment.findById(req.params.id)
    .then(attach => {
      if (!attach) {
        return res.status(400).send("attachment doesn't exist");
      }
      attach.remove();
      return res.send('attachment deleted');
    })
    .catch(err => {
      res.stats(500).send('attachment not deleted');
    });
});

router.post('/', (req, res) => {
  const attach = new Attachment({
    type: req.body.type,
    body: req.body.body,
    post_id: req.body.post_id,
  });
  attach
    .save()
    .then(attach => {
      res.send(attach);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

module.exports = router;
