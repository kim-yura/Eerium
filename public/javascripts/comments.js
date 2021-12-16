document.addEventListener("DOMContentLoaded", (event) => {

  const addCommentButton = document.querySelector(".commentSubmit");

  addCommentButton.addEventListener("click", async (event) => {

    const commentTextarea = document.querySelector(".commentContent");
    const storyId = commentTextarea.getAttribute("storyId");
    const content = commentTextarea.value;
    const body = { content, storyId };

    try {
      const commentJson = await fetch("/comments", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      const newComment = await commentJson.json();
      const { username, comment } = newComment;
      const commentUl = document.querySelector(".commentContainer");
      // console.log(user)
      const commentDiv = document.createElement("div");
      commentDiv.innerHTML = `
                  <p>${username}<p>
                  <li>${comment.content}</li>
                  <button class='editComment'>Edit</button>
                  <button class='deleteComment'>Delete</button>
                  `;

      // commentUl.appendChild(commentDiv);
      commentUl.insertBefore(commentDiv, commentUl.firstChild)
    } catch (error) { }
    commentTextarea.value = "";
  })

  const deleteCommentButton = document.querySelectorAll(`.deleteComment`);

  deleteCommentButton.forEach(button => {
    button.addEventListener("click", async (event) => {
      console.log("DELETE BUTTON")


      // const commentTextarea = document.querySelector(".commentContent");
      // const storyId = commentTextarea.getAttribute("storyId");
      // const content = commentTextarea.value;
      // const body = { id: event.target.id.split("-")[1] };
      const commentId = event.target.id.split("-")[1]


      // const commentUl = document.querySelector(".commentContainer");

      try {
        const res = await fetch("/comments/commentId", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })

        // const commentJson = await fetch("/comments", {
        //   method: "DELETE",
        //   body: JSON.stringify(body),
        //   headers: { "Content-Type": "application/json" },
        // });

        // const deleteComment = await commentJson.json();

        const { message } = { message: 'success :D' };

        if (message === 'success :D') {
            event.target.parentNode.remove()
        }

        // const commentDiv = document.createElement("div");
        // commentDiv.innerHTML = `
        // <p>${username}</p>
        // <li>${comment.content}</li>
        // <button class='editComment'>Edit</button>
        // <button class='deleteComment'>Delete</button>
        // `;

      } catch (error) {
        console.log(error);
      }
    })
  })
})
