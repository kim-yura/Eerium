document.addEventListener("DOMContentLoaded", (event) => {

  //------------------------------ADD COMMENT-------------------------------------//

  const addCommentButton = document.querySelector(".commentSubmit");

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
                  <p>${username}<p>
                  <li>${comment.content}</li>
                  <button class='editComment' id=comment-${comment.id}>Edit</button>
                  <button class='deleteComment' id=comment-${comment.id}>Delete</button>
                  `;

      commentUl.insertBefore(commentDiv, commentUl.firstChild)

      document.querySelector('.deleteComment').addEventListener('click', clickHandlerDelete)
      document.querySelector('.editComment').addEventListener('click',) // TO DO

    } catch (error) { }
    commentTextarea.value = "";
  })

  //------------------------------DELETE COMMENT-------------------------------------//

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
      const storyId = commentTextarea.getAttribute("storyId");
      const content = commentTextarea.value;
      const body = { content, storyId };

      const commentId = event.target.id.split("-")[1]

      try {
        const res = await fetch(`/comments/${commentId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        })

        if (res) {
          event.target.parentNode.update()
        }
      } catch (error) {

        console.log(error);

      }
    })
  })

})
