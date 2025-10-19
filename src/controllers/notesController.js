import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// Усі нотатки
export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

// Нотатка по ID
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

// Створення нотатки
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

// Видалення нотатки
export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

// Оновлення нотатки
export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, },
    req.body,
    { new: true },
  );

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};
