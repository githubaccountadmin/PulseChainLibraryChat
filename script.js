// Get the form element
const form = document.getElementById("userInputForm");

// Get the tweets section element
const tweetsSection = document.getElementById("tweets");

// Listen for form submission
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the form from reloading the page

  // Get the content and post type from the form
  const content = document.getElementById("content").value;
  const postType = document.getElementById("postType").value;

  // Create a new element to hold the post
  const newPost = document.createElement("p");
  newPost.textContent = content;

  // Decide where to add the new post
  const targetSection = document.getElementById(postType + "s");
  targetSection.appendChild(newPost);

  // Clear the textarea
  document.getElementById("content").value = "";
});
