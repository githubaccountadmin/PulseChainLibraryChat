// Initialize a post ID counter
let postId = 0;

// Get the form element
const form = document.getElementById("userInputForm");

// Listen for form submission
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the form from reloading the page

  // Increment the post ID
  postId++;

  // Get the content and post type from the form
  const content = document.getElementById("content").value;
  const postType = document.getElementById("postType").value;

  // Create a new element to hold the post
  const newPost = document.createElement("div");

  // Add a timestamp and ID to the post
  const timestamp = new Date().toLocaleString();
  newPost.innerHTML = `<strong>ID: ${postId}</strong> - <em>${timestamp}</em><br>${content}`;

  // Decide where to add the new post based on its type
  const targetSection = document.getElementById(postType + "s");
  targetSection.appendChild(newPost);

  // Clear the textarea
  document.getElementById("content").value = "";
});
