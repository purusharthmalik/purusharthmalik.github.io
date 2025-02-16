---
layout: default
---

<style>
  /* Global Styles */
  body {
    font-family: 'Inter', sans-serif;
    background-color: #f8f9fa;
    color: #333;
    transition: background-color 0.3s, color 0.3s;
    margin: 0;
    padding: 0;
  }

  .container {
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
    text-align: center;
  }

  /* Title and Dark Mode Toggle */
  .title-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #222;
    margin: 0;
  }

  /* Dark Mode Toggle Button */
  #darkModeToggle {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.3s;
  }

  #darkModeToggle .sun {
    display: none;
  }

  .dark-mode #darkModeToggle .sun {
    display: inline;
  }

  .dark-mode #darkModeToggle .moon {
    display: none;
  }

  /* Blog Post List */
  .post-list {
    list-style: none;
    padding: 0;
    margin-top: 20px;
  }

  .post-list-item {
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-align: left;
  }

  .post-list-item:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  }

  .post-title {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: #222;
  }

  .post-link {
    text-decoration: none;
    color: inherit;
  }

  .post-link:hover {
    text-decoration: underline;
  }

  .post-excerpt {
    font-size: 1rem;
    color: #666;
    margin-bottom: 10px;
  }

  .post-meta {
    font-size: 0.9rem;
    color: #888;
  }

  .archive-link {
    margin-top: 20px;
  }

  .archive-link a {
    font-size: 1rem;
    text-decoration: none;
    color: #0366d6;
    font-weight: bold;
  }

  .archive-link a:hover {
    text-decoration: underline;
  }

  .dark-mode {
    background-color: #121212;
    color: #eee;
  }

  .dark-mode .post-list-item {
    background-color: #1e1e1e;
    color: #ddd;
  }

  .dark-mode .post-title {
    color: #fff;
  }

  .dark-mode .post-excerpt {
    color: #bbb;
  }

  .dark-mode .post-meta {
    color: #aaa;
  }

  .dark-mode .archive-link a {
    color: #4a90e2;
  }
</style>

<div class="container">
  <div class="title-container">
    <h1>🫶 Puru-Logs</h1>
    <button id="darkModeToggle">
      <span class="moon">🌙</span>
      <span class="sun">☀️</span>
    </button>
  </div>
  
  <p>Hi, this is Purusharth. For a very long time, I kept making notes and forgetting about them. Not anymore! Feel free to hit me up to discuss anything regarding my work.</p>

  <ul class="post-list">
    {% for post in site.posts %}
      <li class="post-list-item">
        <a href="{{ post.url }}" class="post-link">
          <div class="post-title">{{ post.title }}</div>
        </a>
        <div class="post-excerpt">{{ post.excerpt }}</div>
        <div class="post-meta">
          <span class="post-date">📅 {{ post.date | date: "%B %d, %Y" }}</span> | ⏳ {{ post.timetoread }} min read | ✍️ Purusharth Malik
        </div>
      </li>
    {% endfor %}
  </ul>
  
  <div class="archive-link">
    <a href="/archive.html">All posts...</a>
  </div>
</div>

<script>
  // Dark Mode Toggle Logic
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
  }

  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
  });
</script>
