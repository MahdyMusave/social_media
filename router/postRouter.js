import express from "express";
const router = express.Router();
import Post from "../model/postModel.js";
import { User } from "../model/userModel.js";
import { userAuth } from "../middleware/authMiddlerware.js";
import Comment from "../model/commentModel.js";
router.get("/", userAuth, async (req, res) => {
  const { _id } = req.user;
  const { search } = req.body;

  try {
    const user = await User.findById({ _id });
    //?? [] : عملگر اپراتور nullish coalescing است. اگر user.friends مقداری داشته باشد، آن مقدار به friends اختصاص داده می‌شود. در غیر این صورت، یک آرایه خالی به friends اختصاص داده می‌شود.
    const friends = user?.friends.toString().split(",") ?? [];
    friends.push(_id);
    // return console.log(user?.friends.toString().split(",")) ?? [];
    const searchPostQuery = {
      $or: {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    };

    const posts = await Post.find(search ? searchPostQuery : {})
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    const friendsPost = posts?.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });

    const otherPost = posts?.filter((post) => {
      return !friends.includes(post?.userId?._id.toString());
    });

    let postRes = null;
    if (friendsPost?.length > 0) {
      postRes = search ? friendsPost : [...friendsPost, ...otherPost];
    } else {
      postRes = posts;
    }

    res.status(200).json({
      success: true,
      message: "successfully",
      data: postRes,
    });
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/:id", userAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({ _id: id }).populate({
      path: "userId",
      select: "firstName lastName location profileUrl -password",
    });
    res.status(200).json({
      success: true,
      message: "successfully",
      data: post,
    });
  } catch (error) {
    throw new Error(error);
  }
});
router.get("/ownUserPost/:id", userAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await Post.find({ userId: id }).populate({
      path: "userId",
      select: "firstName lastName location profileUrl -password",
    });
    res.status(200).json({
      success: true,
      message: "successfully",
      data: posts,
    });
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/getComment/:postId", userAuth, async (req, res, next) => {
  // console.log(postId);
  try {
    const { postId } = req.params;
    const postComments = await Comment.find({ postId })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .populate({
        path: "replies.userId",
        select: "firstName lastName location profileUrl -password",
      });
    // return console.log(postComments);
    res.status(200).json({
      success: true,
      message: "successfully",
      data: postComments,
    });
  } catch (error) {
    throw new Error(error);
  }
});

router.post("/", userAuth, async (req, res, next) => {
  const { _id } = req.user;
  const { username } = req.user;
  const { description, images } = req.body;

  try {
    if (!description) {
      next("please inter your filed");
      return;
    }
    const createPost = await new Post({
      userId: _id,
      description: description,
      images: images,
      author: username,
    });
    await createPost.save();
    res.status(200).json({
      success: true,
      message: "Post created successfully",
      data: createPost,
    });
  } catch (error) {
    throw new Error(error);
  }
});

router.post("/likes/:id", userAuth, async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;
  // return console.log(postId);
  try {
    const post = await Post.findById(id);

    const index = post.likes.findIndex((pid) => pid === String(_id));

    if (index === -1) {
      post.likes.push(_id);
    } else {
      post.likes = post.likes.filter((pid) => pid !== String(_id));
    }

    const newPost = await Post.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "successfully",
      data: newPost,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "something was wronging",
    });
  }
});
router.post(
  "/likeComment/:commentId?/:replyCommentId?",

  userAuth,
  async (req, res, next) => {
    const { _id } = req.user;
    const { commentId, replyCommentId } = req.params;
    // return console.log(req.params);
    try {
      if (
        replyCommentId == undefined ||
        replyCommentId == null ||
        replyCommentId == "false"
      ) {
        const comment = await Comment.findById(commentId);
        const index = comment.likes.findIndex((el) => el === stringify(_id));
        // return console.log(comment);
        // return console.log(index);
        if (index == -1) {
          comment.likes.push(_id);
        } else {
          comment.likes = comment.likes.filter((i) => i !== string(_id));
        }
        // return console.log(comment);
        const updated = await Comment.findByIdAndUpdate(commentId, comment, {
          new: true,
        });
        // return console.log(updated);
        res.status(201).json(updated);
      } else {
        // return console.log( replyCommentId);
        const replyComments = await Comment.findOne(
          { _id: commentId },

          {
            replies: {
              $elemMatch: {
                _id: replyCommentId,
              },
            },
          }
        );
        // return console.log(replyComments);
        const index = replyComments?.replies[0]?.likes.findIndex(
          (i) => i == string(_id)
        );
        // return console.log(index);
        if (index === -1) {
          replyComments.replies[0].likes.push(_id);
          // return console.log(replyComments);
        } else {
          replyComments.replies[0].likes =
            replyComments.replies[0]?.likes.filter((i) => i !== String(_id));
        }
        // return console.log(replyComments);
        const query = {
          _id: commentId,
          "replies._id": replyCommentId,
        };
        // return console.log(query);
        const updated = {
          $set: {
            "replies.$.likes": replyComments.replies[0].likes,
          },
        };
        // return console.log(updated);
        const result = await Comment.updateOne(query, updated, {
          new: true,
        });
        // return console.log(result);
        //
        res.status(201).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something was wronging",
      });
    }
  }
);
router.post("/createComment/:id", userAuth, async (req, res, next) => {
  // return console.log(req.params);
  const { _id } = req.user;
  const { id } = req.params;
  const { comment, from } = req.body;
  // return console.log(comment, from);
  try {
    if (comment == null) {
      return res.status(404).json({
        message: "Comment is required",
      });
    }
    const newComment = await Comment.create({
      comment,
      from,
      userId: _id,
      postId: id,
    });
    // return console.log(newComment);

    //updating the post with the comment id
    const post = await Post.findById(id);
    // return console.log(post);
    post.comments.push(newComment._id);
    // return console.log(post);
    const updatePost = await Post.findByIdAndUpdate(id, post, {
      new: true,
    });
    // return console.log(updatePost);
    res.status(201).json({
      success: true,
      message: "add likes with successfully",
      data: updatePost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something was wronging",
      data: newLikes,
    });
  }
});
router.post("/reply-comment/:id", userAuth, async (req, res, next) => {
  // return console.log(req.params);
  const { _id } = req.user;
  const { comment, replyAt, from } = req.body;
  const postId = req.params.id;
  // return console.log(comment, replyAt, from, _id);
  if (comment == null) {
    return res.status(404).json({
      message: "comment is required",
    });
  }

  try {
    const commentInfo = await Comment.findById(postId);
    // return console.log(commentInfo);
    commentInfo.replies.push({
      comment,
      replyAt,
      from,
      userId: _id,
      created_AT: Date.now(),
    });
    // return console.log(commentInfo);
    commentInfo.save();
    res.status(200).json(commentInfo);
  } catch (error) {}
});
router.put("/:id", userAuth, async (req, res) => {
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

router.delete("/:id", userAuth, async (req, res, nex) => {
  const { id } = req.params;
  try {
    const deletePost = await Post.deleteOne({ _id: id });
    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//other way
// router.put("/likes/:id", async (req, res) => {
//   const { id } = req.params;
//   const { userId } = req.body;
//   try {
//     const findPost = await Post.findOne({ _id: id });
//     // return console.log(findPost);
//     if (!findPost.likes.includes(userId)) {
//       const likes = await Post.updateMany({ $push: { likes: userId } });
//       return res.json({
//         likes,
//         msg: "ok",
//       });
//     } else {
//       const unLikes = await Post.updateMany({ $pull: { likes: userId } });
//       return res.json({
//         unLikes,
//         msg: "remove like",
//       });
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });
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

export default router;
