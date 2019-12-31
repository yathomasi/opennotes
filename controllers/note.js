const db = require("../db/models");
const Note = require("../db/models/note")(db.sequelize);
const errors = require("restify-errors");
exports.listNotes = (req, res, next) => {
  Note.findAll()
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
  Note.findOne({ where: { noteId: noteId } })
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
  res.json({ msg: "Handle post note here" });
  next();
};
exports.updateNote = (req, res, next) => {
  res.json({ msg: "Update the given note" });
  next();
};
exports.deleteNote = (req, res, next) => {
  res.json({ msg: "delete the given note" });
  next();
};
