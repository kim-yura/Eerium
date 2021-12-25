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
          let value = parseInt(document.getElementById(`counter-${commentId}`).innerText, 10);
          console.log("valplus", value);
          value++;
          console.log("valplus", value);
          document.getElementById(`counter-${commentId}`).innerText = value;
        } else {
          event.target.innerText = "Like";
          let value = parseInt(document.getElementById(`counter-${commentId}`).innerText, 10);
          console.log("valminus", value);
          value--;
          console.log("valminus", value);
          document.getElementById(`counter-${commentId}`).innerText = value
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
    const commentTextarea = document.querySelector(".commentContent");
    // console.log(event.target.parentNode.childNodes[1].textContent)
    const submit = document.querySelector(".commentSubmit")
    commentTextarea.innerText = event.target.parentNode.childNodes[1].textContent
    const updateBtn = document.createElement("button")
    updateBtn.innerText = "Update"
    updateBtn.className = "updateBtn"
    if (!document.querySelector(".updateBtn")) {
      submit.after(updateBtn)
    }
    const commentId = event.target.id.split("-")[3]
    updateBtn.addEventListener("click", async (e) => {
      const storyId = commentTextarea.getAttribute("storyId");
      const content = commentTextarea.value;
      const body = { content, storyId };
      commentTextarea.value = ""
      event.target.parentNode.childNodes[1].innerText = content
      updateBtn.remove()
      try {
        const res = await fetch(`/comments/${commentId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        })

        if (res) {
          event.target.parentNode.childNodes[3].innerText = content
          // event.target.parentNode.update()
        }
      } catch (error) {

        console.log(error);

      }
    })

  }

  addCommentButton.addEventListener("click", async (event) => {

    const commentTextarea = document.querySelector(".commentContent");
    const storyId = commentTextarea.getAttribute("storyId");
    const content = commentTextarea.value;
    const body = { content, storyId };
    // const commentId = event.target.id.split("-")[1]

    try {
      const commentJson = await fetch("/comments", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      const newComment = await commentJson.json();
      const { username, comment } = newComment;
      const commentUl = document.querySelector(".commentContainer");

      const commentDiv = document.createElement("div");

      commentDiv.innerHTML = `
                  <p class="comment-author">${username}<p>
                  <li>${comment.content}</li>
                  <p id=counter-${comment.id}>0<p>
                  <button class='commentLike' id=${comment.id}>Like</button>
                  <button class='editComment' id=comment-${comment.id}>Edit Comment</button>
                  <button class='deleteComment' id=comment-${comment.id}>Delete Comment</button>
                  `;
      commentDiv.classList.add("comment");

      commentUl.insertBefore(commentDiv, commentUl.firstChild)
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
        let value = parseInt(document.getElementById(`counter-${commentId}`).innerText, 10);
        console.log("valplus", value);
        value++;
        console.log("valplus", value);
        document.getElementById(`counter-${commentId}`).innerText = value;
      } else {
        event.target.innerText = "Like";
        let value = parseInt(document.getElementById(`counter-${commentId}`).innerText, 10);
        console.log("valminus", value);
        value--;
        console.log("valminus", value);
        document.getElementById(`counter-${commentId}`).innerText = value
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

      const commentTextarea = document.querySelector(".commentContent");

      const submit = document.querySelector(".commentSubmit")
      commentTextarea.innerText = event.target.parentNode.childNodes[1].textContent
      const updateBtn = document.createElement("button")
      updateBtn.innerText = "Update"
      updateBtn.className = "updateBtn"
      if (!document.querySelector(".updateBtn")) {
        submit.after(updateBtn)
        submit.remove()
      }
      const commentId = event.target.id.split("-")[1]
      updateBtn.addEventListener("click", async (e) => {
        const storyId = commentTextarea.getAttribute("storyId");
        const content = commentTextarea.value;
        const body = { content, storyId };
        // commentTextarea.innerText=""
        commentTextarea.value = ""
        event.target.parentNode.childNodes[1].innerText = content
        updateBtn.after(submit)
        updateBtn.remove()
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
    })
  })

})
