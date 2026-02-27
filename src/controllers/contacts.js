import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found all contacts',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById({
    _id: contactId,
    userId: req.user._id,
  });
  if (!contact) {
    throw createHttpError(404, `Contact with id ${contactId} was not found`);
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const contactData = {
    userId: req.user._id,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email || '',
  };

  try {
    if (req.file) {
      contactData.photo = req.file.path || req.file.buffer;
    }

    const contact = await createContact(contactData);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.photo = req.file.buffer;
    }

    const result = await updateContact(
      { _id: contactId, userId: req.user._id },
      updateData
    );

    if (!result) {
      throw createHttpError(404, `Contact with id ${contactId} was not found`);
    }

    res.status(200).json({
      status: 200,
      message: `Successfully patched contact with id ${contactId}!`,
      data: result.contact,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(
    { _id: contactId, userId: req.user._id },
    req.body,
    { upsert: true },
  );
  if (!result) {
    throw createHttpError(404, `Contact with id ${contactId} was not found`);
  }
  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted contact with id ${contactId}!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact({ _id: contactId, userId: req.user._id });
  if (!contact) {
    throw createHttpError(404, `Contact with id ${contactId} was not found`);
  }
  res.status(204).send();
};
