document.addEventListener("DOMContentLoaded", (event) => {

  //------------------------------ADD COMMENT-------------------------------------//

  const addCommentButton = document.querySelector(".commentSubmit");

  const clickHandlerLike = async (event) => {
        const commentId = event.target.id;
        // console.log(event.target.id);
        const body = { commentId };
        const res = await fetch("/stories/likes", {
          method: "PUT",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        // console.log("Today is Friday", data);
        if (data.message === "Liked!") {
          event.target.innerText = "Liked"
          let value = Number((document.getElementById(`counter-${commentId}`).innerText).slice(7));
          console.log("valplus", value);
          value++;
          console.log("valplus", value);
          document.getElementById(`counter-${commentId}`).innerText = `Likes: ${value}`
        } else {
          event.target.innerText = "Like";
          let value = Number((document.getElementById(`counter-${commentId}`).innerText).slice(7));
          console.log("valminus", value);
          value--;
          console.log("valminus", value);
          document.getElementById(`counter-${commentId}`).innerText = `Likes: ${value}`
        }
  }

  const clickHandlerDelete = async (event) => {

    const commentId = event.target.id.split("-")[1]

    try {
      const res = await fetch(`/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (res) {
        event.target.parentNode.remove()
        event.target.remove()
        // event.target.parentNode.parentNode.remove()

      }
    } catch (error) {

      console.log(error);

    }
  }

  const clickHandlerEdit = async (event) => {

    const updateBtn = document.createElement("button")
    const cancelBtn = document.createElement("button")
    updateBtn.classList.add("updateBtn")
    updateBtn.innerText = "Update"
    cancelBtn.classList.add("cancelBtn")
    cancelBtn.innerText = "Cancel"
    const currComment = event.target.parentNode.childNodes[1].textContent
    const currCommentTag = event.target.parentNode.childNodes[1]
    const editComment = document.createElement("input");
    editComment.setAttribute("value", currComment);
    const editBtn = event.target.parentNode.childNodes[4]
    const deleteBtn = event.target.parentNode.childNodes[5]
    const commentId = event.target.id.split("-")[1]
    const commentTextarea = document.querySelector(".commentContent");

      editBtn.after(updateBtn)
      editBtn.remove()
      deleteBtn.after(cancelBtn)
      deleteBtn.remove()
      currCommentTag.after(editComment)
      currCommentTag.style.display = "none"
      editComment.classList.add("commentInput")
    updateBtn.addEventListener("click", async (event) => {
      updateBtn.after(editBtn)
      updateBtn.remove()
      cancelBtn.after(deleteBtn)
      cancelBtn.remove()
      const updatedComment = editComment.value
      currCommentTag.innerText = updatedComment
      currCommentTag.style.display = "block"
      editComment.remove()
      const storyId = commentTextarea.getAttribute("storyId");
      const content = updatedComment;
      const body = { content, storyId };
      try {
        const res = await fetch(`/comments/${commentId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        })
        if (res) {
          event.target.parentNode.childNodes[1].innerText = content
          // event.target.parentNode.update()
        }
      } catch (error) {
        console.log(error);
      }
    })
    cancelBtn.addEventListener("click", async (event) => {
      // editing = false;
      updateBtn.after(editBtn)
      updateBtn.remove()
      cancelBtn.after(deleteBtn)
      cancelBtn.remove()
      currCommentTag.style.display = "block"
      editComment.remove()
  })

    // const commentTextarea = document.querySelector(".commentContent");
    // // console.log(event.target.parentNode.childNodes[1].textContent)
    // const submit = document.querySelector(".commentSubmit")
    // commentTextarea.innerText = event.target.parentNode.childNodes[1].textContent
    // const updateBtn = document.createElement("button")
    // updateBtn.innerText = "Update"
    // updateBtn.className = "updateBtn"
    // const commentId = event.target.id.split("-")[3]
    // updateBtn.addEventListener("click", async (e) => {
    //   const storyId = commentTextarea.getAttribute("storyId");
    //   const content = commentTextarea.value;
    //   const body = { content, storyId };
    //   commentTextarea.value = ""
    //   event.target.parentNode.childNodes[1].innerText = content
    //   updateBtn.remove()
    //   try {
    //     const res = await fetch(`/comments/${commentId}`, {
    //       method: "PATCH",
    //       body: JSON.stringify(body),
    //       headers: { "Content-Type": "application/json" },
    //     })

    //     if (res) {
    //       event.target.parentNode.childNodes[3].innerText = content
    //       // event.target.parentNode.update()
    //     }
    //   } catch (error) {

    //     console.log(error);

    //   }
    // })

  }

  addCommentButton.addEventListener("click", async (event) => {

    const commentTextarea = document.querySelector(".commentContent");
    const storyId = commentTextarea.getAttribute("storyId");
    const content = commentTextarea.value;
    const body = { content, storyId };
    // const commentId = event.target.id.split("-")[1]

    try {
      const res = await fetch("/comments", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const { username, comment } = data;
      const ul = document.querySelector(".commentContainer");
      const div = document.createElement("div");
      div.classList.add("comment");
      div.innerHTML = `
                  <p class="comment-author">${username}</p>
                  <li>${comment.content}</li>
                  <p class="comment-likes-counter" id=counter-${comment.id}>Likes: 0</p>
                  <button class='commentLike' id=${comment.id}>Like</button>
                  <button class='editComment' id=comment-${comment.id}>Edit Comment</button>
                  <button class='deleteComment' id=comment-${comment.id}>Delete Comment</button>
                  `;


      ul.insertBefore(div, ul.firstChild)
      document.querySelector('.commentLike').addEventListener('click', clickHandlerLike)
      document.querySelector('.deleteComment').addEventListener('click', clickHandlerDelete)
      document.querySelector('.editComment').addEventListener('click', clickHandlerEdit) // TO DO

    } catch (error) { }
    commentTextarea.value = "";
  })

  //------------------------------DELETE COMMENT-------------------------------------//

  const commentLikes = document.querySelectorAll(`.commentLike`);
  commentLikes.forEach(button => {
    button.addEventListener("click", async (event) => {
      const commentId = event.target.id;
      // const storyId = await Comment.findOne({
      //     include: Story,
      //     where: {storyId}
      // })
      // console.log(storyId);
      console.log(event.target.id);
      const body = { commentId };
      const res = await fetch("/stories/likes", {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("Today is Friday", data);
      if (data.message === "Liked!") {
        event.target.innerText = "Liked"
        let value = Number((document.getElementById(`counter-${commentId}`).innerText).slice(7));
        console.log("valplus", value);
        value++;
        console.log("valplus", value);
        document.getElementById(`counter-${commentId}`).innerText = `Likes: ${value}`
      } else {
        event.target.innerText = "Like";
        let value = Number((document.getElementById(`counter-${commentId}`).innerText).slice(7));
        console.log("valminus", value);
        value--;
        console.log("valminus", value);
        document.getElementById(`counter-${commentId}`).innerText = `Likes: ${value}`
      }
    })
  })

  const deleteCommentButton = document.querySelectorAll(`.deleteComment`);

  deleteCommentButton.forEach(button => {
    button.addEventListener("click", async (event) => {

      const commentId = event.target.id.split("-")[1]

      try {
        const res = await fetch(`/comments/${commentId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })

        if (res) {
          event.target.parentNode.remove()
          event.target.remove()
          // event.target.parentNode.parentNode.remove()

        }
      } catch (error) {

        console.log(error);

      }
    })
  })

  //------------------------------EDIT COMMENT-------------------------------------//


  const editCommentButton = document.querySelectorAll(".editComment");
  editCommentButton.forEach(button => {
    button.addEventListener("click", async (event) => {

      const updateBtn = document.createElement("button")
      const cancelBtn = document.createElement("button")
      updateBtn.classList.add("updateBtn")
      updateBtn.innerText = "Update"
      cancelBtn.classList.add("cancelBtn")
      cancelBtn.innerText = "Cancel"
      const currComment = event.target.parentNode.childNodes[1].textContent
      const currCommentTag = event.target.parentNode.childNodes[1]
      const editComment = document.createElement("input");
      editComment.setAttribute("value", currComment);
      const editBtn = event.target.parentNode.childNodes[4]
      const deleteBtn = event.target.parentNode.childNodes[5]
      const commentId = event.target.id.split("-")[1]
      const commentTextarea = document.querySelector(".commentContent");

        editBtn.after(updateBtn)
        editBtn.remove()
        deleteBtn.after(cancelBtn)
        deleteBtn.remove()
        currCommentTag.after(editComment)
        currCommentTag.style.display = "none"
        editComment.classList.add("commentInput")
      updateBtn.addEventListener("click", async (event) => {
        updateBtn.after(editBtn)
        updateBtn.remove()
        cancelBtn.after(deleteBtn)
        cancelBtn.remove()
        const updatedComment = editComment.value
        currCommentTag.innerText = updatedComment
        currCommentTag.style.display = "block"
        editComment.remove()
        const storyId = commentTextarea.getAttribute("storyId");
        const content = updatedComment;
        const body = { content, storyId };
        try {
          const res = await fetch(`/comments/${commentId}`, {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          })
          if (res) {
            event.target.parentNode.childNodes[1].innerText = content
            // event.target.parentNode.update()
          }
        } catch (error) {
          console.log(error);
        }
      })
      cancelBtn.addEventListener("click", async (event) => {
        // editing = false;
        updateBtn.after(editBtn)
        updateBtn.remove()
        cancelBtn.after(deleteBtn)
        cancelBtn.remove()
        currCommentTag.style.display = "block"
        editComment.remove()
    })
    })
  })

})
