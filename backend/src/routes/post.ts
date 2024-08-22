import { Router } from "express"
import { createPost, deletePost, getBlog, getBlogs, updatePost } from "../controllers/post"

const router = Router()

router.route("/").get(getBlogs)
router.route("/:id").get(getBlog)
router.route("/").post(createPost)
router.route("/:id").put(updatePost)
router.route("/:id").delete(deletePost)

export default router;