import { Router } from "express"
import { createPost, deletePost, getBlog, getBlogs, updatePost } from "../controllers/post"
import { verifyJWT } from "../middlewares/auth"

const router = Router()

router.route("/").get(getBlogs)
router.route("/:id").get(getBlog)

router.use(verifyJWT)

router.route("/").post(createPost)
router.route("/:id").put(updatePost)
router.route("/:id").delete(deletePost)

export default router;