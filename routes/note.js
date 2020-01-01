const noteController = require("../controllers/note");

module.exports = server => {
  server.get("/api/v1/notes", noteController.listNotes);
  server.get("/api/v1/notes/:id", noteController.getNote);
  server.post("/api/v1/notes/", noteController.postNote);
  server.put("/api/v1/notes/:id", noteController.updateNote);
  server.del("/api/v1/notes/:id", noteController.deleteNote);
};
