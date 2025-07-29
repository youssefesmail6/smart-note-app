import { Response, NextFunction } from "express";
import { NoteService } from "../services/note.service";
import Container, { Inject } from "typedi";
import { Service } from "typedi";
import { AuthRequest } from "../middlewares/auth.middleware";
import CreateNoteDto from "../dto/createNote.dto";

@Service()
 class NoteController {
  public noteService: NoteService = Container.get(NoteService);

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, content } = req.body as CreateNoteDto;
      const userId = req.jwt?.userId;
      if (!userId) throw new Error("User ID missing in token");
      const note = await this.noteService.createNote(title, content, userId);
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.jwt?.userId;
      if (!userId) throw new Error("User ID missing in token");
      await this.noteService.deleteNote(id, userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  summarize = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.jwt?.userId;
      if (!userId) throw new Error("User ID missing in token");
      const summary = await this.noteService.summarizeNote(id, userId);
      res.json(summary);
    } catch (err) {
      next(err);
    }
  };
}
export default NoteController;