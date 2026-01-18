import { model, Schema } from "mongoose";

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      required: false,
      default: false,
    },
    contactType: {
      type: String,
      enum: ["work", "home", "personal"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "contacts",
  },
);

export const ContactsCollection = model("Contact", contactsSchema);
