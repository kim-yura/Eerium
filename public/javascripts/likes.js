document.addEventListener("DOMContentLoaded", (event) => {
  /*
  FRONT
  Grab all of the comment like buttons--Options for that would be something like doc query select all
  Iterate over all grabbed buttons while adding event listeners to each button
      grab comment id attached to the button
      put grabbed ID and put them into a body object
      add fetch to method (PUT) and add to this a path of stories/comments/likes, and send body object
      grab data from fetch(res=) and parse out json (await res.json())
      if message === Liked!
          update inner content of e.target text to say the message
      else
          update inner content of e.target text to say the OTHER message
  */
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

      } else {
        event.target.innerText = "Like"
      }
    })
  })

  const storyLikes = document.querySelector(`.storyLike`);

  storyLikes.addEventListener("click", async (event) => {

    const storyId = event.target.id;

    const body = { storyId };
    const res = await fetch("/stories/storyLikes", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.message === "Liked!") {
      event.target.innerText = "Liked";
      const value = parseInt(document.getElementById(`counter-${comment.id}`).value, 10);
      console.log(value);
      value++;
      console.log(value);
      document.getElementById(`counter-${comment.id}`).innerText = value
    } else {
      event.target.innerText = "Like";
      const value = parseInt(document.getElementById(`counter-${comment.id}`).value, 10);
      value--;
      document.getElementById(`counter-${comment.id}`).innerText = value
    }
  })
})
