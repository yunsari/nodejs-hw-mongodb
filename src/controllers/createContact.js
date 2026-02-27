import { Contact } from '../db/models/contacts.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const createContact = async (req, res) => {
  let photoUrl = null;

  if (req.file) {
    photoUrl = await uploadToCloudinary(req.file);
  }

  const contact = await Contact.create({
    ...req.body,
    photo: photoUrl,
    userId: req.user._id,
  });

  res.status(201).json(contact);
};