import Contact from "../db/models/contact.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  type,
  isFavourite,
}) => {
  const limit = Number(perPage);
  const skip = (Number(page) - 1) * limit;
  const order = sortOrder === "desc" ? -1 : 1;

  const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === "true";
  }

  const totalItems = await Contact.countDocuments(filter);

  const data = await Contact.find(filter)
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    page: Number(page),
    perPage: limit,
    totalItems,
    totalPages,
    hasPreviousPage: Number(page) > 1,
    hasNextPage: Number(page) < totalPages,
  };
};

export const getContactById = (contactId) => {
  return Contact.findById(contactId);
};

export const createContact = (payload) => {
  return Contact.create(payload);
};

export const updateContact = (contactId, payload) => {
  return Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
};

export const deleteContact = (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};
