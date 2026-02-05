/*
    HTTP Method	Controller	Response	URI	Use Case
    GET	index	200	/hoots	List hoots
    GET	show	200	/hoots/:hootId	Get a single hoot
    PUT	update	200	/hoots/:hootId	Update a hoot
    DELETE	deleteHoot	200	/hoots/:hootId	Delete a hoot
    POST	createComment	200	/hoots/:hootId/comments	Create a comment
*/
const router = require("express").Router();
const Hoot = require("../models/hoot");
const CATEGORIES = ["News", "Sports", "Games", "Movies", "Music", "Television"];

// POST	create	200	/hoots	Create a hoot
router.post("/", async (req, res) => {
  try {
    // checks / verifications
    if (!CATEGORIES.includes(req.body.category)) {
      throw new Error(
        `${req.body.category} is not a valid category. Please provide one of: ${CATEGORIES.join(", ")}`,
      );
    }

    if (!req.body.text.trim() || !req.body.title.trim()) {
      throw new Error(
        `The body and title fields must have valid text`,
      );
    }

    req.body.author = req.user._id;
    const hoot = await Hoot.create(req.body);

    res.status(201).json({ hoot });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

module.exports = router;
