document.addEventListener("DOMContentLoaded", (event) => {
    const followButton = document.querySelector(".profile-follow");
    followButton.addEventListener("click", async (event) => {
        const creatorId = event.target.id;
        const body = { creatorId };
        const res = await fetch("/follows/newFollow", {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data.message === "Followed") {
            event.target.innerText = "Following";
            let value = parseInt(document.getElementById(`counter-${creatorId}`).innerText, 10);
            value++
            document.getElementById(`counter-${creatorId}`).innerText = value + ' Followers'
        } else {
            event.target.innerText = "Follow";
            let value = parseInt(document.getElementById(`counter-${creatorId}`).innerText, 10);
            value--
            document.getElementById(`counter-${creatorId}`).innerText = value + ' Followers'
        }
    })
})
