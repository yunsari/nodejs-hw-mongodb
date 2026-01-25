import createError from "http-errors";
import * as contactsService from "../services/contacts.js";

export const createContactController = async (req, res) => {
  const contact = await contactsService.createContact(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
};

export const getAllContactsController = async (req, res) => {
  const contacts = await contactsService.getAllContacts();

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await contactsService.deleteContact(contactId);

  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.status(204).send();
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const payload = req.body;

  const updatedContact = await contactsService.updateContact(
    contactId,
    payload,
  );

  if (!updatedContact) {
    throw createError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: updatedContact,
  });
};
