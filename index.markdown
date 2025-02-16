---
layout: default
---

<style>
  /* Base styles (Light Mode) */
  body {
    font-family: sans-serif;
    background-color: #fff;
    color: #333;
    transition: background-color 0.3s, color 0.3s;
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
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #333; /* Darker border in light mode */
    border-radius: 5px;
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    background-color: #333;
    transition: background-color 0.3s;
    color: #fff; /*White Text*/
  }

  .post-list-item:hover {
      background-color: #444; /* Slightly lighter on hover */
    }

.post-title {
    font-size: 1.2em; /* Larger title */
    font-weight: bold;
    margin-bottom: 5px;
    color: #fff; /* White title text */
}
  .post-link{
    text-decoration: none;
    color: inherit;
  }
  .post-link:hover{
    text-decoration: underline;
    color: inherit;
  }

.post-excerpt {
    margin-bottom: 10px;
    color: #eee; /* Light grey for excerpt text */
    line-height: 1.4; /* Improve readability */
}

 .post-meta {
    font-size: 0.8em;
    color: #999; /* Light grey for meta info */
}
  .post-date{
    color: inherit;
    min-width: fit-content;
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
    background-color: #121212;
    color: #eee;
}
.dark-mode .post-list-item {
    background-color: #333; /* Consistent dark background */
    border-color: #333; /* Consistent dark border */
    color: #fff; /* White text in dark mode */
}

.dark-mode .post-title {
    color: #fff; /* Ensure title is white in dark mode */
}

.dark-mode .post-excerpt {
    color: #eee; /* Consistent excerpt color */
}

.dark-mode .post-meta {
    color: #999; /* Consistent meta color */
}
  .dark-mode .post-list-item:hover{
    background-color: #444;
  }

  .dark-mode .post-link {
    color: inherit; /* Inherit from parent (white) */
  }
  .dark-mode .post-date{
    color: inherit;
  }
    .dark-mode .archive-link a{
        color: #4a90e2;
    }

  /* Dark Mode Toggle Button */
  #darkModeToggle {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #555;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1000;
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

  <ul class="post-list">
    {% for post in site.posts %}
      <li class="post-list-item">
        <a href="{{ post.url }}" class = "post-link">
            <div class="post-title">{{ post.title }}</div>
        </a>
        <div class="post-excerpt">{{ post.excerpt }}</div>
        <div class="post-meta">
           <span class = "post-date"> Date: {{ post.date | date: "%B %d, %Y" }} </span> | Estimated Reading Time: 37 min | Author: Purusharth Malik
        </div>
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