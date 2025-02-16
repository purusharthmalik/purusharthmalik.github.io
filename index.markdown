---
layout: default
---

<style>
  /* Base styles (Light Mode) */
  body {
    font-family: sans-serif;
    background-color: #fff;
    color: #333;
    transition: background-color 0.3s, color 0.3s; /* Smooth transition */
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .profile-pic {
    float: right;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-left: 20px;
    margin-bottom: 20px;
    object-fit: cover;
  }

  .post-list {
    list-style: none;
    padding: 0;
  }

  .post-list-item {
    margin-bottom: 20px; /* More spacing between boxes */
    padding: 15px; /* Padding inside the box */
    border: 1px solid #ddd; /* Light border */
    border-radius: 5px; /* Rounded corners */
    display: flex;
    background-color: #f9f9f9; /* Slightly off-white background */
    transition: background-color 0.3s; /* Smooth transition for hover */
  }
  .post-list-item:hover {
      background-color: #f0f0f0;
  }

  .post-date {
    color: #666;
    font-size: 0.9em;
    margin-bottom: 5px;
    min-width: 100px;
  }

  .post-link {
    text-decoration: none;
    color: #0366d6;
    font-weight: bold;
    margin-left: 15px;
  }

  .post-link:hover {
    text-decoration: underline;
  }

  .about-me-text,
  .contact-info {
    margin-bottom: 20px;
  }

  .contact-link {
    margin-right: 10px;
    text-decoration: none;
    color: #0366d6;
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }

  .contact-link img {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }

  .archive-link a {
    text-decoration: none;
    color: #0366d6;
  }

  .archive-link a:hover {
    text-decoration: underline;
  }

  /* Dark Mode Styles */
  .dark-mode {
    background-color: #121212; /* Dark background */
    color: #eee; /* Light text */
  }

  .dark-mode .post-list-item {
    background-color: #242424; /* Darker box background */
    border-color: #444; /* Darker border */
  }
  .dark-mode .post-list-item:hover{
    background-color: #303030;
  }

  .dark-mode .post-link {
    color: #4a90e2; /* Lighter blue for links */
  }
  .dark-mode .post-date{
    color: #999;
  }
    .dark-mode .archive-link a{
        color: #4a90e2;
    }

  /* Dark Mode Toggle Button */
  #darkModeToggle {
    position: fixed; /* Fixed position */
    top: 20px; /* Adjust as needed */
    right: 20px; /* Adjust as needed */
    background-color: #555;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1000; /* Ensure it's on top */
  }
  #darkModeToggle:hover {
    background-color:#333
  }
  .dark-mode #darkModeToggle{
    background-color: #ddd;
    color: black;
  }
  .dark-mode #darkModeToggle:hover{
    background-color: #eee;
  }
</style>

<button id="darkModeToggle">Toggle Dark Mode</button>

<div class="container">

  <h1>🫶Welcome to my technical rants!</h1>

  Hi, this is Purusharth. For a very long time, I kept making notes and forgetting about them. 
  Not anymore! Feel free to hit me up to discuss anything regarding my work.

  <div class="contact-info">
     <a href="mailto:purusharth19malik@gmail.com" class="contact-link"><img src="https://www.flaticon.com/free-icons/email" alt="Email"></a>
     <a href="https://github.com/purusharthmalik" class="contact-link"><img src="https://www.flaticon.com/free-icons/github" alt="GitHub"></a>
     <a href="https://www.linkedin.com/in/purusharth-malik-33a31616b/" class="contact-link"><img src="https://www.flaticon.com/free-icons/linkedin" alt="LinkedIn"></a>
  </div>

  <ul class="post-list">
    {% for post in site.posts %}
      <li class="post-list-item">
        <span class="post-date">{{ post.date | date_to_string }}</span>
        <a href="{{ post.url }}" class="post-link">{{ post.title }}</a>
      </li>
    {% endfor %}
  </ul>
  <div class = "archive-link">
    <a href="/archive.html">All posts...</a>
  </div>

</div>

<script>
  // Dark Mode Toggle Logic
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Check for saved preference
  const currentMode = localStorage.getItem('darkMode');
  if (currentMode === 'enabled') {
    body.classList.add('dark-mode');
  }

  darkModeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    } else {
      body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    }
  });
</script>