const router = require("express").Router();
const { index, deleteHoot, update, create, show, addComment, updateComment, deleteComment} = require('../controllers/hoot')

//   GET index 200	/hoots	List hoots
router.get("/", index);

//  DELETE	deleteHoot	200	/hoots/:hootId	Delete a hoot
router.delete("/:hootId", deleteHoot);

//   PUT	update	200	/hoots/:hootId	Update a hoot
router.put("/:hootId", update);

// POST	create	200	/hoots	Create a hoot
router.post("/", create);

//  GET	show	200	/hoots/:hootId	Get a single hoot
router.get("/:hootId", show);

// POST /hoot/:hootId/comments
router.post("/:hootId/comments", addComment);

// PUT /hoots/:hootId/comments/:commentId
router.put("/:hootId/comments/:commentId", updateComment);

// Delete /hoots/:hootId/comments/:commentId
router.delete("/:hootId/comments/:commentId", deleteComment);

module.exports = router;
