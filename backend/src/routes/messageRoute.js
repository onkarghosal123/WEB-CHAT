import {Router} from "express";
import { checkAuth } from "../middleware/auth.js";
import { upload } from "../lib/multer.js";
import {sendMessage, getAllContacts, getallMsgbyId, getChatContacts,updateSeenMsg,updateMsg,deleteMsg } from "../controller/messageController.js";

const router = Router();

router.use(checkAuth);

router.get('/contacts',getAllContacts)
router.get('/chats',getChatContacts)
router.post("/send/:id",upload.single("picture"),sendMessage)//upload picture to multer which get from frontend
router.post("/update-msg/:id",updateMsg)
router.delete("/delete/:id",deleteMsg)
router.post("/seen-msg/:id",updateSeenMsg)
router.get('/:id',getallMsgbyId)

export default router;