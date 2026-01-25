import { ContactsCollection } from "../db/models/contact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";
import { nanoid } from "nanoid";

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactsById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contacts = await readContacts();

  const newContact = {
    id: nanoid(),
    ...payload,
    createdAt: new Date().toISOString(),
  };

  contacts.push(newContact);
  await writeContacts(contacts);

  return newContact;
};

export const updateContactById = async (contactId, payload) => {
  const contacts = await readContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const updatedContact = {
    ...contacts[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  contacts[index] = updatedContact;
  await writeContacts(contacts);

  return updatedContact;
};

export const deleteContactById = async (contactId) => {
  const contacts = await readContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const [deletedContact] = contacts.splice(index, 1);
  await writeContacts(contacts);

  return deletedContact;
};
