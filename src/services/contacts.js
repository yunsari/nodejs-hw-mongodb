import Contact from "../db/models/contact.js";

export const getAllContacts = async ({
  userId,
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

  const filter = { userId };

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

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return await Contact.create(payload);
};

export const updateContact = async (contactId, userId, payload) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true }
  );
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
