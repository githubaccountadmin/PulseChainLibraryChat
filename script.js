document.addEventListener("DOMContentLoaded", () => {
  const postButton = document.getElementById("postButton");
  postButton.addEventListener("click", () => {
    const postType = document.getElementById("postType").value;
    console.log("Post Type:", postType); // Debug line
    const postContent = document.getElementById("postContent").value;
    const timestamp = new Date().toISOString();
    const postId = Math.random().toString(36).substr(2, 9);

    const newPost = document.createElement("div");
    newPost.innerHTML = `
      <h2>${postType} - ID: ${postId}</h2>
      <p>${postContent}</p>
      <small>${timestamp}</small>
    `;

    const targetSection = document.getElementById(postType.toLowerCase() + "s");
    console.log("Target section ID:", postType.toLowerCase() + "s"); // Debug line
    console.log("Target section:", targetSection); // Debug line

    targetSection.appendChild(newPost);
  });
});
