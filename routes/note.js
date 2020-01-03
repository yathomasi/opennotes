const noteController = require("../controllers/note");
const {
  postNoteValidation,
  updateNoteValidation,
  validate
} = require("../middleware/validator");
const auth = require("../middleware/auth");

module.exports = server => {
  server.get("/api/v1/notes", noteController.listNotes);
  server.get("/api/v1/notes/:id", noteController.getNote);
  server.post(
    "/api/v1/notes",
    postNoteValidation(),
    validate,
    auth.authJWT,
    noteController.postNote
  );
  server.put(
    "/api/v1/notes/:id",
    updateNoteValidation(),
    validate,
    auth.authJWT,
    noteController.updateNote
  );
  server.del("/api/v1/notes/:id", auth.authJWT, noteController.deleteNote);
};
