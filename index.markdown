---
layout: default
---

<style>
    /* Global Styles (theme-aware) */
    body {
        font-family: 'Inter', sans-serif;
        background: var(--bg, #f8f9fa);
        color: var(--text, #222);
        transition: background 0.3s, color 0.3s;
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
        color: var(--text, #222);
        margin: 0;
    }

    /* Dark Mode Toggle Button (uses site data-theme attribute)
       If you have an inline toggle with id `darkModeToggle`, this
       will adapt to the site's theme state. */
    #darkModeToggle {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.3s;
        color: var(--muted, #fff);
    }

    #darkModeToggle .sun {
        display: none;
    }

    :root[data-theme='dark'] #darkModeToggle .sun {
        display: inline;
    }

    :root[data-theme='dark'] #darkModeToggle .moon {
        display: none;
    }

    /* Blog Post List */
    .post-list {
        list-style: none;
        padding: 0;
        margin-top: 20px;
    }

    .post-list-item {
        background: var(--card-bg, #ffffff);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.06);
        margin-bottom: 20px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-align: left;
        cursor: pointer; /* Indicate clickable */
    }

    .post-list-item:hover {
        transform: translateY(-5px);
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
    }

    .post-title {
        font-size: 1.4rem;
        font-weight: bold;
        margin-bottom: 10px;
        color: var(--text, #222);
    }

    .post-link {
        text-decoration: none;
        color: inherit;
        display: block;
        height: 100%;
    }

    .post-link:hover {
        text-decoration: underline;
    }

    .post-excerpt {
        font-size: 1rem;
        color: var(--muted, #666);
        margin-bottom: 10px;
    }

    .post-meta {
        font-size: 0.9rem;
        color: var(--muted, #888);
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
</style>

<div class="container">
    <div class="title-container">
        <h1>🫶 Welcome to my technical rants! ☀️</h1>
    </div>
    <p>
        Hi, this is Purusharth. For a very long time, I kept making notes and forgetting about them. Not anymore!
        Feel free to hit me up to discuss anything regarding my work.
    </p>
    <ul class="post-list">
        {% for post in site.posts %}
        <li class="post-list-item" onclick="window.location='{{ post.url }}'">
            <div class="post-title">{{ post.title }}</div>
            <div class="post-excerpt">{{ post.excerpt }}</div>
            <div class="post-meta">
                <span class="post-date">📅 {{ post.date | date: "%B %d, %Y" }}</span> | ⏳ {{ post.timetoread }} min
                read | ✍️ Purusharth Malik
            </div>
        </li>
        {% endfor %}
    </ul>
    <div class="archive-link">
        <a href="/archive/">All posts...</a>
    </div>
    
    <!-- Resume section: place a PDF at /assets/resume.pdf to render here -->
    <div class="resume-section" style="margin-top:28px;text-align:left;">
        <h2 style="margin-bottom:0.5rem;color:var(--text, #222);">Resume</h2>
        <p style="color:var(--muted,#666);margin-top:0;">View or download my resume below.</p>
        <object data="{{ '/assets/resume.pdf' | relative_url }}" type="application/pdf" width="100%" height="600">
            <p>Resume PDF not found. <a href="{{ '/assets/resume.pdf' | relative_url }}">Download resume</a>.</p>
        </object>
    </div>
    <!-- <div style="margin-top: 20px; text-align: center;">
        <p>Page Views:</p>
        <img src="https://visitor-badge.glitch.me/badge?page_id=purusharthmalik.github.io" alt="Visitor Count">
    </div> -->
</div>