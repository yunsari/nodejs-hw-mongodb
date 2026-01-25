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
