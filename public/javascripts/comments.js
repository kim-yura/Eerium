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

  // const deleteCommentButton = document.querySelector(`deleteComment_${event.target.id}`);
  const deleteCommentButton = document.querySelector("[class^='deleteComment']");

  deleteCommentButton.addEventListener("click", async (event) => {

    console.log("DELETE BUTTON", event.target.id)

    const commentTextarea = document.querySelector(".commentContent");
    const storyId = commentTextarea.getAttribute("storyId");
    const content = commentTextarea.value;
    const body = { content, storyId };
    const commentUl = document.querySelector(".commentContainer");

    try {
      const commentJson = await fetch("/comments", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });


      const commentDiv = document.createElement("div");
      commentDiv.innerHTML = `
                  <p>${username}</p>
                  <li>${comment.content}</li>
                  <button class='editComment'>Edit</button>
                  <button class='deleteComment'>Delete</button>
                  `;

      const verifyDelete = document.createElement("div");
      verifyDelete.innerHTML = `
                  <p>Are you sure you want to delete this comment?</p>
                  <button class='deleteComment'>Delete</button>
                  <button class='cancelDelete'>Cancel</button>
                  `;

      commentDiv.appendChild(verifyDelete);

    } catch (error) { }

    console.log(error);
  })




})
