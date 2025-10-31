import createHttpError from "http-errors";
import { Note } from "../models/note.js";

// Отримання усіх нотаток
export const getAllNotes = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      tag,
      search
    } = req.query;

    const skip = (page - 1) * perPage;
    const notesQuery = Note.find({ userId: req.user._id });

    if (tag) {
      notesQuery.where("tag").equals(tag);
    }
    if (search) {
      notesQuery.where({
        $text: { $search: search },
      });
    }

    const [totalNotes, notes] = await Promise.all([
      notesQuery.clone().countDocuments(),
      notesQuery.skip(skip).limit(perPage),
    ]);

    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });

  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Отримання конкретної нотатки
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }
    res.status(200).json(note);

  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Створення нотатки
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(note);

  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Оновлення info нотатки
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate({
      _id: noteId,
      userId: req.user._id,
    },
    req.body, { new: true });

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(note);

  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Видалення нотатки
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(note);

  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
