const noteController = require("../controllers/note");
const { postNoteValidation, validate } = require("../middleware/validator");

module.exports = server => {
  server.get("/api/v1/notes", noteController.listNotes);
  server.get("/api/v1/notes/:id", noteController.getNote);
  server.post(
    "/api/v1/notes",
    postNoteValidation(),
    validate,
    noteController.postNote
  );
  server.put("/api/v1/notes/:id", validate, noteController.updateNote);
  server.del("/api/v1/notes/:id", noteController.deleteNote);
};
