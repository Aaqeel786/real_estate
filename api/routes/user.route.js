import { deleteUser, test, updateUser} from "../controllers/user.controller.js";
import express from "express";
import { verifyToken } from "../utils/verifyUsers.js";
import { getUserListings } from "../controllers/listing.controller.js";

const router = express.Router();
router.get("/test",test);
router.post("/update/:id",verifyToken,updateUser)
router.get("/listings/:id",verifyToken,getUserListings)


export default router;