import createError from "http-errors";
import * as contactsService from "../services/contacts.js";

export const createContactController = async (req, res) => {
  const contact = await contactsService({
    ...req.body,
    userId: req.user.id, 
  });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
};

export const getAllContactsController = async (req, res) => {
  const result = await getAllContacts({
    userId: req.user._id,
    ...req.query,
  });

  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data: result,
  });
};

export const getContactController = async (req, res) => {
  const contact = await getContactById(
    req.params.contactId,
    req.user._id
  );

  if (!contact) throw createHttpError(404);

  res.json({
    status: 200,
    message: "Successfully found contact!",
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const contact = await deleteContact(
    req.params.contactId,
    req.user._id
  );

  if (!contact) throw createHttpError(404);

  res.status(204).send();
};

export const updateContactController = async (req, res) => {
  const contact = await updateContact(
    req.params.contactId,
    req.user._id,
    req.body
  );

  if (!contact) throw createHttpError(404);

  res.json({
    status: 200,
    message: "Successfully updated contact!",
    data: contact,
  });
};

