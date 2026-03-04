import { Contact } from '../db/models/contacts.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import { createContactService } from '../services/contacts.js';

export const createContact = async (req, res, next) => {
  try {
    let photoUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload_stream({
        folder: 'contacts',
      });

      photoUrl = result.secure_url;
    }

    const contact = await createContactService({
      ...req.body,
      userId: req.user._id,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};