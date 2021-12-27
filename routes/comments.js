//-------------------------------------------------------------------IMPORTS------------------------------------------------------------------//

const express = require('express');
const commentsRouter = express.Router();
const { check, validationResult } = require('express-validator');

const { sequelize, Comment, Story, User, Like } = require('../db/models');

const { asyncHandler, csrfProtection, handleValidationErrors } = require('./utils');
const { loginUser, logoutUser, requireAuth, restoreUser } = require('../auth');

//-------------------------------------------------------------------VALIDATIONS------------------------------------------------------------------//

const commentValidations = [
  check("content")
    .exists({ checkFalsy: true })
    .withMessage("Comment can not be empty."),
];

//-------------------------------------------------------------------CREATE COMMENT------------------------------------------------------------------//

commentsRouter.post("/", commentValidations, asyncHandler(async (req, res, next) => {
  const userId = req.session.auth.userId;
  const sessionUser = await User.findByPk(userId);

  const username = sessionUser.username
  const { content, storyId } = req.body;
  const comment = await Comment.create({
    content,
    userId,
    storyId
  })
  res.json({ username, comment })
}))

//-------------------------------------------------------------------DELETE COMMENT------------------------------------------------------------------//


commentsRouter.delete('/:id(\\d+)', asyncHandler(async (req, res, next) => {

  const commentId = parseInt(req.params.id, 10);

  const comment = await Comment.findByPk(commentId);
  const likes = await Like.findAll({
    where: { commentId },
    include: [User, Comment],
  })
  for (let like of likes) {
    await like.destroy();
}

  await comment.destroy()

  res.json("Comment Deleted.")
}))

//-------------------------------------------------------------------EDIT COMMENT------------------------------------------------------------------//

commentsRouter.patch('/:id(\\d+)', commentValidations, asyncHandler(async (req, res, next) => {
  console.log("REQ", req.body)
  const commentId = parseInt(req.params.id, 10);
  const comment = await Comment.findByPk(commentId);
  comment.content = req.body.content
  await comment.save()
  res.json("Comment Edited Successfully .")
}))



module.exports = commentsRouter

// document.addEventListener("DOMContentLoaded", (event) => {

//   //------------------------------ADD COMMENT-------------------------------------//

//   const addCommentButton = document.querySelector(".commentSubmit");

//   const clickHandlerDelete = async (event) => {

//     const commentId = event.target.id.split("-")[1]

//     try {
//       const res = await fetch(`/comments/${commentId}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       })

//       if (res) {
//         event.target.parentNode.remove()
//         event.target.remove()
//         // event.target.parentNode.parentNode.remove()

//       }
//     } catch (error) {

//       console.log(error);

//     }
//   }

//   const clickHandlerEdit = async (event) => {
//     const commentTextarea = document.querySelector(".commentContent");
//     // console.log(event.target.parentNode.childNodes[1].textContent)
//     const submit = document.querySelector(".commentSubmit")
//     commentTextarea.innerText = event.target.parentNode.childNodes[1].textContent
//     const updateBtn = document.createElement("button")
//     updateBtn.innerText = "Update"
//     updateBtn.className = "updateBtn"
//     if (!document.querySelector(".updateBtn")) {
//       submit.after(updateBtn)
//     }
//     const commentId = event.target.id.split("-")[3]
//     updateBtn.addEventListener("click", async (e) => {
//       const storyId = commentTextarea.getAttribute("storyId");
//       const content = commentTextarea.value;
//       const body = { content, storyId };
//       commentTextarea.value = ""
//       event.target.parentNode.childNodes[1].innerText = content
//       updateBtn.remove()
//       try {
//         const res = await fetch(`/comments/${commentId}`, {
//           method: "PATCH",
//           body: JSON.stringify(body),
//           headers: { "Content-Type": "application/json" },
//         })

//         if (res) {
//           event.target.parentNode.childNodes[3].innerText = content
//           // event.target.parentNode.update()
//         }
//       } catch (error) {

//         console.log(error);

//       }
//     })

//   }

//   addCommentButton.addEventListener("click", async (event) => {

//     const commentTextarea = document.querySelector(".commentContent");
//     const storyId = commentTextarea.getAttribute("storyId");
//     const content = commentTextarea.value;
//     const body = { content, storyId };
//     // const commentId = event.target.id.split("-")[1]

//     try {
//       const commentJson = await fetch("/comments", {
//         method: "POST",
//         body: JSON.stringify(body),
//         headers: { "Content-Type": "application/json" },
//       });
//       const newComment = await commentJson.json();
//       const { username, comment } = newComment;
//       const commentUl = document.querySelector(".commentContainer");

//       const commentDiv = document.createElement("div");

//       commentDiv.innerHTML = `
//                   <p class="comment-author">${username}<p>
//                   <li>${comment.content}</li>
//                   <button class='editComment' id=comment-${comment.id}>Edit Comment</button>
//                   <button class='deleteComment' id=comment-${comment.id}>Delete Comment</button>
//                   `;
//       commentDiv.classList.add("comment");

//       commentUl.insertBefore(commentDiv, commentUl.firstChild)

//       document.querySelector('.deleteComment').addEventListener('click', clickHandlerDelete)
//       document.querySelector('.editComment').addEventListener('click', clickHandlerEdit) // TO DO

//     } catch (error) { }
//     commentTextarea.value = "";
//   })

//   //------------------------------DELETE COMMENT-------------------------------------//

//   const deleteCommentButton = document.querySelectorAll(`.deleteComment`);

//   deleteCommentButton.forEach(button => {
//     button.addEventListener("click", async (event) => {

//       const commentId = event.target.id.split("-")[1]

//       try {
//         const res = await fetch(`/comments/${commentId}`, {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//         })

//         if (res) {
//           event.target.parentNode.remove()
//           event.target.remove()
//           // event.target.parentNode.parentNode.remove()

//         }
//       } catch (error) {

//         console.log(error);

//       }
//     })
//   })

//   //------------------------------EDIT COMMENT-------------------------------------//


//   const editCommentButton = document.querySelectorAll(".editComment");
//   let editing = false
//   editCommentButton.forEach(button => {
//     button.addEventListener("click", async (event) => {
//       // const updateBtn = document.createElement("button")
//       // const cancelBtn = document.createElement("button")
//       // const currComment = event.target.parentNode.childNodes[1].textContent
//       // const editComment = document.createElement("input");
//       // editComment.setAttribute("value", currComment);
//       if (!editing) {
//         editing = true
//         event.target.innerText = "Update"
//         event.target.parentNode.childNodes[5].innerText = "Cancel"
//         // updateBtn.classList.add("updateBtn")
//         // updateBtn.innerText = "Update"
//         // event.target.after(updateBtn)
//         // event.target.remove()
//       } else {
//         editing = false;
//         event.target.innerText = "Edit Comment"
//         event.target.parentNode.childNodes[5].innerText = "Delete Comment"
//       }

//       // const commentTextarea = document.querySelector(".commentContent");

//       // const submit = document.querySelector(".commentSubmit")
//       // commentTextarea.innerText = event.target.parentNode.childNodes[1].textContent
//       // const updateBtn = document.createElement("button")
//       // updateBtn.innerText = "Update"
//       // updateBtn.className = "updateBtn"
//       // if (!document.querySelector(".updateBtn")) {
//       //   submit.after(updateBtn)
//       //   submit.remove()
//       // }
//       // const commentId = event.target.id.split("-")[1]
//       // updateBtn.addEventListener("click", async (e) => {
//       //   const storyId = commentTextarea.getAttribute("storyId");
//       //   const content = commentTextarea.value;
//       //   const body = { content, storyId };
//       //   // commentTextarea.innerText=""
//       //   commentTextarea.value = ""
//       //   event.target.parentNode.childNodes[1].innerText = content
//       //   updateBtn.after(submit)
//       //   updateBtn.remove()
//         try {
//           const res = await fetch(`/comments/${commentId}`, {
//             method: "PATCH",
//             body: JSON.stringify(body),
//             headers: { "Content-Type": "application/json" },
//           })
//           if (res) {
//             event.target.parentNode.childNodes[1].innerText = content
//             // event.target.parentNode.update()
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       })
//     })
// })
