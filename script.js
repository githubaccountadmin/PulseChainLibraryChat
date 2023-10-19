// Get the form element
const form = document.getElementById("userInputForm");

// Get the tweets section element
const tweetsSection = document.getElementById("tweets");

// Listen for form submission
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the form from reloading the page

  // Get the content from the textarea
  const content = document.getElementById("content").value;

  // Create a new element to hold the tweet
  const newTweet = document.createElement("p");
  newTweet.textContent = content;
  
  // Add the new tweet to the tweets section
  tweetsSection.appendChild(newTweet);

  // Clear the textarea
  document.getElementById("content").value = "";
});
