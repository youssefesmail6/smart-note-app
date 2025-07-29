import { Router } from "express";
import NoteController from "../controllers/note.controller";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import { generalLimiter, loginLimiter } from "../middlewares/rateLimit.middleware";
import { Container } from "typedi";
import ValidationMiddleware from "../middlewares/validation.middleware";
import CreateNoteDto from "../dto/createNote.dto";

const router = Router();
const controller = Container.get(NoteController);

/**
 * @route POST /notes
 * @desc Create a new note
 * @access Private
 * @rate-limit General
 */
router.post("/v1/notes", generalLimiter, IsAuthenticatedMiddleware, ValidationMiddleware(CreateNoteDto), controller.create);

/**
 * @route DELETE /notes/:id
 * @desc Delete a note by ID (only if owned by user)
 * @access Private
 * @rate-limit General
 */
router.delete("/v1/notes/:id", generalLimiter, IsAuthenticatedMiddleware, controller.delete);

/**
 * @route POST /notes/:id/summarize
 * @desc Summarize note content using OpenAI
 * @access Private
 * @rate-limit Strict (to protect OpenAI tokens)
 */
router.post(
  "/notes/:id/summarize",
  loginLimiter,
  IsAuthenticatedMiddleware,
  controller.summarize
);

export default router;
