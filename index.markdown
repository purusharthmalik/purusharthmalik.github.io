---
layout: default
---

<style>
  /* Add custom CSS for styling similar to Lilian's site */
  .container {
    max-width: 800px; /* Adjust as needed */
    margin: 0 auto;
    padding: 20px;
  }

  .profile-pic {
    float: right;
    width: 150px; /* Adjust as needed */
    height: 150px; /* Adjust as needed */
    border-radius: 50%; /* Makes it a circle */
    margin-left: 20px;
    margin-bottom: 20px;
    object-fit: cover;
  }

  .post-list {
    list-style: none;
    padding: 0;
  }

  .post-list-item {
    margin-bottom: 10px;
    display:flex;
  }

 .post-date {
    color: #666;
    font-size: 0.9em;
    margin-bottom: 5px;
    min-width: 100px;

  }

  .post-link {
    text-decoration: none;
    color: #0366d6; /* Or any color you prefer */
    font-weight: bold;
    margin-left: 15px
  }
  .post-link:hover {
   text-decoration: underline;
  }

  .about-me-text, .contact-info {
    margin-bottom: 20px;
  }

   .contact-link {
        margin-right: 10px; /* Spacing between links */
        text-decoration: none; /* Remove underlines */
        color: #0366d6;
    }
   .contact-link:hover {
        text-decoration: underline; /* Add underline on hover */
    }
    .archive-link a{
        text-decoration: none;
        color: #0366d6;
    }
    .archive-link a:hover{
        text-decoration: underline;
    }

</style>

<div class="container">

  <h1>🫶Welcome to my technical rants!</h1>

  Hi, this is Purusharth. For a very long time, I kept making notes and forgetting about them. Not anymore! Feel free to hit me up to discuss anything regarding my work.

  <div class="contact-info">

     <a href="mailto:purusharth19malik@gmail.com" class="contact-link">Email</a>
     <a href="https://github.com/purusharthmalik" class="contact-link">GitHub</a>
     <a href="https://www.linkedin.com/in/purusharth-malik-33a31616b/" class="contact-link">LinkedIn</a>

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