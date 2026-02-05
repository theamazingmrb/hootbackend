const Hoot = require("../models/hoot");
const CATEGORIES = ["News", "Sports", "Games", "Movies", "Music", "Television"];

//   GET index 200	/hoots	List hoots
const index = async (req, res) => {
  try {
    const hoots = await Hoot.find()
      .populate("author")
      .sort({ createdAt: "desc" });

    res.status(200).json(hoots);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

//  DELETE	deleteHoot	200	/hoots/:hootId	Delete a hoot
const deleteHoot = async (req, res) => {
  try {
    // const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId)
    const hootToDelete = await Hoot.findById(req.params.hootId);
    if (!hootToDelete) {
      res.status(404);
      throw new Error("Could not find hoot to delete");
    }

    // check if signed in user owns this hoot
    if (!hootToDelete.author.equals(req.user._id)) {
      res.status(403);
      throw new Error("You are not authorized to delete this hoot");
    }

    await hootToDelete.deleteOne();

    res.status(200).json(hootToDelete);
  } catch (error) {
    const { statusCode } = res;
    res
      .status([403, 404].includes(statusCode) ? statusCode : 500)
      .json({ err: error.message });
    // if (res.statusCode === 403) {
    //   res.json({ err: error.message });
    // } else {
    //   res.status(500).json({ err: error.message });
    // }
  }
};

//   PUT	update	200	/hoots/:hootId	Update a hoot
const update = async (req, res) => {
  try {
    const foundHoot = await Hoot.findById(req.params.hootId);
    if (!foundHoot.author.equals(req.user._id)) {
      res.status(403); // not authorized
      throw new Error(`You can only edit hoots you own`);
    }

    if (!CATEGORIES.includes(req.body.category)) {
      throw new Error(
        `${req.body.category} is not a valid category. Please provide one of: ${CATEGORIES.join(", ")}`,
      );
    }

    if (!req.body.text.trim() || !req.body.title.trim()) {
      throw new Error(`The body and title fields must have valid text`);
    }

    const updatedHoot = await Hoot.findByIdAndUpdate(
      req.params.hootId,
      req.body,
      { new: true },
    );

    if (!updatedHoot) {
      throw new Error("Failed to updated hoot. Please try again");
    }

    updatedHoot._doc.author = req.user;

    res.status(200).json(updatedHoot);
  } catch (error) {
    if (res.statusCode === 403) {
      res.json({ err: error.message });
    } else {
      res.status(500).json({ err: error.message });
    }
  }
};

// POST	create	200	/hoots	Create a hoot
const create = async (req, res) => {
  try {
    // checks / verifications
    if (!CATEGORIES.includes(req.body.category)) {
      throw new Error(
        `${req.body.category} is not a valid category. Please provide one of: ${CATEGORIES.join(", ")}`,
      );
    }

    if (!req.body.text.trim() || !req.body.title.trim()) {
      throw new Error(`The body and title fields must have valid text`);
    }

    req.body.author = req.user._id;
    const hoot = await Hoot.create(req.body);

    hoot._doc.author = req.user; // req.user = { username: '...', _id: '..'}

    res.status(201).json({ hoot });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

//  GET	show	200	/hoots/:hootId	Get a single hoot
const show = async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId).populate([
      "author",
      "comments.author",
    ]);
    if (!hoot) {
      res.status(404);
      throw new Error(
        "We cannot find this hoot, please select another hoot from the list",
      );
    }

    res.status(200).json(hoot);
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ err: error.message });
    } else {
      res.status(500).json({ err: error.message });
    }
  }
};

// POST /hoot/:hootId/comments
const addComment = async (req, res) => {
  try {
    req.body.author = req.user._id; // { author: someId, text: "Some comment"}
    const updatedHoot = await Hoot.findByIdAndUpdate(
      req.params.hootId,
      {
        $push: { comments: req.body },
      },
      { new: true },
    );

    //  ** Another way we can do it **
    // const hoot = await Hoot.findById(req.params.hootId);
    // hoot.comments.push(req.body);
    // await hoot.save();

    const comment = updatedHoot.comments.at(-1);
    comment._doc.author = req.user;

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

// PUT /hoots/:hootId/comments/:commentId
const updateComment = async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);

    if (!comment.author.equals(req.user._id)) {
      res.status(403); // not authorized
      throw new Error(`You can only edit comments you own`);
    }

    if (!req.body.text.trim()) {
      res.status(406);
      throw new Error(`The text field must have valid text`);
    }

    req.body.author = req.user._id;
    comment.set(req.body);

    await hoot.save();

    comment._doc.author = req.user;
    res.status(200).json(comment);
  } catch (error) {
    const { statusCode } = res;
    res
      .status([403, 406].includes(statusCode) ? statusCode : 500)
      .json({ err: error.message });
  }
};

// Delete /hoots/:hootId/comments/:commentId
const deleteComment = async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);
    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    if (!comment.author.equals(req.user._id)) {
      res.status(406);
      throw new Error("You are not authorized to delete this comment");
    }

    await comment.deleteOne();
    await hoot.save();
    res.status(200).json({ status: "Successfully Deleted" });
  } catch (error) {
    res
      .status([404, 406].includes(statusCode) ? statusCode : 500)
      .json({ err: error.message });
  }
};

module.exports = {
  index,
  deleteHoot,
  update,
  create,
  show,
  addComment,
  updateComment,
  deleteComment,
};
