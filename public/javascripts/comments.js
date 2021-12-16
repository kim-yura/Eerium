document.addEventListener("DOMContentLoaded", (event)=>{
    const addCommentButton = document.querySelector(".commentSubmit");
    addCommentButton.addEventListener("click", async (event) =>{
        const commentTextarea = document.querySelector(".commentContent");
        const storyId = commentTextarea.getAttribute("storyId");
        const content = commentTextarea.value;
        const body = {content, storyId};
        try {
            const commentJson = await fetch("/comments", {
              method: "POST",
              body: JSON.stringify(body),
              headers: { "Content-Type": "application/json" },
            });
            const newComment = await commentJson.json();
            const { comment, user } = newComment;
            const commentUl = document.querySelector(".commentContainer");
            // console.log(user)
            const commentDiv = document.createElement("div");
            commentDiv.innerHTML = `
                  <p>${user}<p>
                  <li>${comment.content}</li>
                  <button class='editComment'>Edit</button>
                  <button class='deleteComment'>Delete</button>
                  `;

            commentUl.appendChild(commentDiv);
          } catch (error) { }
        console.log("zhen")
        commentTextarea.value = "";
    })

})
