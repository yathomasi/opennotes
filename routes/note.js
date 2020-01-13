const noteController = require("../controllers/note");
const {
  postNoteValidation,
  updateNoteValidation,
  validate
} = require("../middleware/validator");
const auth = require("../middleware/auth");

module.exports = server => {
  server.get("/api/v1/notes", auth.validJWT, noteController.listNotes);
  server.get("/api/v1/notes/:id", auth.validJWT, noteController.getNote);
  server.post(
    "/api/v1/notes",
    postNoteValidation(),
    validate,
    auth.validJWT,
    noteController.postNote
  );
  server.put(
    "/api/v1/notes/:id",
    updateNoteValidation(),
    validate,
    auth.validJWT,
    noteController.updateNote
  );
  server.del("/api/v1/notes/:id", auth.validJWT, noteController.deleteNote);
};
