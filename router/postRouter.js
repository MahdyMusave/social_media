const router = require("express").Router();
const { Error } = require("mongoose");
const Post = require("../model/postModel");
const User = require("../model/userModel");
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({ _id: id });
    res.json(post);
  } catch (error) {
    throw new Error(error);
  }
});

router.post("/", async (req, res) => {
  // return console.log(req.body);
  try {
    const createPost = await new Post({
      userId: req.body.userId,
      content: req.body.content,
      author: req.body.author,
    });
    await createPost.save();
    res.json({
      createPost,
      msg: "ok",
    });
  } catch (error) {
    throw new Error(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatePost = await Post.findByIdAndUpdate(id, {
      $set: req.body,
    });
    res.json({
      updatePost,
      msg: "update post",
    });
  } catch (error) {
    throw new Error(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletePost = await Post.deleteOne({ _id: id });
    res.json(deletePost);
  } catch (error) {
    throw new Error(error);
  }
});
router.put("/likes/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const findPost = await Post.findOne({ _id: id });
    // return console.log(findPost);
    if (!findPost.likes.includes(userId)) {
      const likes = await Post.updateMany({ $push: { likes: userId } });
      return res.json({
        likes,
        msg: "ok",
      });
    } else {
      const unLikes = await Post.updateMany({ $pull: { likes: userId } });
      return res.json({
        unLikes,
        msg: "remove like",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
router.get("/timeLine/all", async (req, res) => {
  const { userId } = req.body;
  // return console.log(userId);
  try {
    const currentUser = await User.findOne({ _id: userId });
    const userPosts = await Post.find({ userId: currentUser._id });
    // return console.log(userPosts);
    const friendPosts = await Promise.all(
      currentUser.following.map((freindId) => {
        Post.find({ userId: freindId });
      })
    );
    // return console.log(friendPosts);
    res.json(userPosts.concat(...friendPosts));
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
