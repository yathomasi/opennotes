const noteController = require("../controllers/note");

module.exports = server => {
  server.get("/notes", noteController.listNotes);
  server.get("/notes/:id", noteController.getNote);
  server.post("/notes/", noteController.postNote);
  server.put("/notes/:id", noteController.updateNote);
  server.del("/notes/:id", noteController.deleteNote);
};
