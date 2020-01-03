const models = require("../db/models");
const errors = require("restify-errors");

exports.listNotes = (req, res, next) => {
  models.Note.findAll()
    .then(notes => {
      res.json(notes);
    })
    .catch(err => {
      return next(new errors.InvalidContentError(err));
    });
  next();
};

exports.getNote = (req, res, next) => {
  const noteId = req.params.id;
  models.Note.findOne({ where: { noteId } })
    .then(user => {
      if (user === null) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no notes with the id of ${noteId}`
          )
        );
      }
      res.json(user);
    })
    .catch(err => {
      return next(new errors.InvalidContentError(err));
    });
  next();
};

exports.postNote = (req, res, next) => {
  let { title, content, UserId } = req.body;
  models.Note.create({
    title,
    content,
    UserId
  })
    .then(note => {
      let data = {
        msg: "New Note succesfully created.",
        data: note
      };
      res.json(data);
      next();
    })
    .catch(err => {
      return next(new errors.InvalidContentError(err));
    });
  next();
};

exports.updateNote = (req, res, next) => {
  const noteId = req.params.id;
  let { title, content } = req.body;
  models.Note.update(
    {
      title,
      content
    },
    { where: { noteId: noteId } }
  )
    .then(note => {
      if (note[0]) {
        res.json({ msg: "Note updated succesfully." });
        next();
      } else {
        return next(
          new errors.ResourceNotFoundError(
            `There is no notes with the id of ${noteId}`
          )
        );
      }
    })
    .catch(err => {
      return next(new errors.InvalidContentError(err));
    });
  next();
};

exports.deleteNote = (req, res, next) => {
  const noteId = req.params.id;
  models.Note.destroy({ where: { noteId: noteId } })
    .then(result => {
      if (!result) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no notes with the id of ${req.params.id}`
          )
        );
      }
      res.json({ msg: "Note is succesfully deleted." });
    })
    .catch(err => {
      return next(new errors.InvalidContentError(err));
    });
};
