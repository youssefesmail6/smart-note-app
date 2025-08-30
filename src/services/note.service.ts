import Container, { Service, Inject } from "typedi";
import notesModel, { INote } from "../models/notes.model";
import NotFoundException from "../exceptions/not-found.exception";
import ForbiddenAccessException from "../exceptions/forbidden-access.exception";
import { OpenAIService } from "./openAi.service";




@Service()
export class NoteService {
   openAiService = Container.get(OpenAIService);

  async createNote(title: string, content: string, ownerId: string): Promise<INote> {
    return await notesModel.create({ title, content, owner: ownerId });
  }

  async deleteNote(noteId: string, userId: string): Promise<void> {
    const note = await notesModel.findById(noteId);
    if (!note) throw new NotFoundException("Note not found");
    if (note.owner.toString() !== userId) throw new ForbiddenAccessException("Not authorized to delete this note");
    await note.deleteOne();
  }

  async summarizeNote(noteId: string, userId: string): Promise<{ summary: string }> {
    const note = await notesModel.findById(noteId);
    if (!note) throw new NotFoundException("Note not found");
    if (note.owner.toString() !== userId) throw new ForbiddenAccessException("Not authorized to summarize this note");

    const summary = await this.openAiService.summarizeText(note.content);
    return { summary };
  }
}
