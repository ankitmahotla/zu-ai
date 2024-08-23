import { Router } from "express"
import { createComment, deleteComment, getComments, updateComment } from "../controllers/comment"
import { verifyJWT } from "../middlewares/auth"

const router = Router()

router.route("/").get(getComments)

router.use(verifyJWT)

router.route("/").post(createComment)
router.route("/:id").put(updateComment)
router.route("/:id").delete(deleteComment)

export default router;