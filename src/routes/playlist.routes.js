import { Router } from "express";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/create", createPlaylist);
router.get("/:userId", getUserPlaylists);
router.get("/playlist/:playlistId", getPlaylistById);
router.post("/add-video/:playlistId", addVideoToPlaylist);
router.post("/remove-video/:playlistId", removeVideoFromPlaylist);
router.delete("/:playlistId", deletePlaylist);
router.put("/:playlistId", updatePlaylist);

export default router;