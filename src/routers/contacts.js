import { Router } from "express";
import {
  createContactController,
  getAllContactsController,
  deleteContactController,
  updateContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.get("/", ctrlWrapper(getAllContactsController));
router.post("/", ctrlWrapper(createContactController));
router.patch("/:contactId", ctrlWrapper(updateContactController));
router.delete("/:contactId", ctrlWrapper(deleteContactController));

export default router;
