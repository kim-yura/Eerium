document.addEventListener("DOMContentLoaded", (event) => {

    // create vote button
    // let like = document.createElement("button")

    // const likeStoryButton = document.querySelector(".storyLike");
    // const likeCommentButton = document.querySelector(".commentLike");

    // likeStoryButton.classList.add("like")
    // likeStoryButton.classList.add("on")

    // likeCommentButton.classList.add("like")
    // likeCommentButton.classList.add("on")

    // //~~~~~LIKE STORY~~~~~//

    // likeStoryButton.addEventListener("click", event => {
    //     // console.log(event.target.classList)
    //     if (event.target.classList.value === "like on") {
    //         event.target.classList.remove("on")
    //     } else event.target.classList.add("on")
    // })

    // //~~~~~LIKE COMMENT~~~~~//

    // likeCommentButton.addEventListener("click", event => {
    //     // console.log(event.target.classList)
    //     if (event.target.classList.value === "like on") {
    //         event.target.classList.remove("on")
    //     } else event.target.classList.add("on")
    // })

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





})
