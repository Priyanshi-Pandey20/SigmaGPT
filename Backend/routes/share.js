import express from  "express";
import {v4 as uuidv4} from "uuid"

const router = express.Router();

const sharedChats = {};

router.post("/",(req,res)=>{
    const {chats} = req.body;

    const id = uuidv4();
    sharedChats[id] = chats;

    res.json({id});
});

router.get("/:id", (req, res) => {
    const chat = sharedChats[req.params.id];

    if (!chat) {   // ✅ FIXED
        return res.status(404).json({ message: "Not found" });
    }

    res.json({ chat });
});
export default router;