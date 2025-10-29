import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const objectIdValidator = (value, helpers) => {
  const isValid = isValidObjectId(value);
  return !isValid ? helpers.message("Invalid id format!") : value;
};

// Отримання схеми усіх нотаток
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS).optional(),
    search: Joi.string().allow(""),
  }),
};

// Отримання схеми нотатки по ID
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// Створення схеми нотатки
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().max(1000).allow(""),
    tag: Joi.string().valid(...TAGS).optional(),
  }),
};

// Оновлення схеми нотакти
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().max(1000).allow(""),
    tag: Joi.string().valid(...TAGS),
  }).min(1),
};
