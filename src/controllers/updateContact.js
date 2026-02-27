import { Contact } from '../db/models/contact.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const updateContact = async (req, res) => {
  let updateData = { ...req.body };

  if (req.file) {
    updateData.photo = await uploadToCloudinary(req.file);
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.contactId,
    updateData,
    { new: true }
  );

  res.json(contact);
};