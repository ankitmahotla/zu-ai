import { Router } from "express";
import {
  createPost,
  deletePost,
  getBlog,
  getBlogs,
  updatePost,
  getBlogByTitleOrContent,
} from "../controllers/post";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

router.route("/").get(getBlogs);
router.route("/searchBlog").get(getBlogByTitleOrContent);
router.route("/:id").get(getBlog);

router.use(verifyJWT);

router.route("/").post(createPost);
router.route("/:id").put(updatePost);
router.route("/:id").delete(deletePost);

export default router;
