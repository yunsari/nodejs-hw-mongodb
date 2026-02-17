import mongoose, { model, Schema } from "mongoose";

const contactsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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

const Contact = model("Contact", contactsSchema);
export default Contact;
