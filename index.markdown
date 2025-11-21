---
layout: default
---

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
        <li class="post-list-item">
            <a href="{{ post.url }}" class="post-link">
                <div class="post-title">{{ post.title }}</div>
                <div class="post-excerpt">{{ post.excerpt }}</div>
                <div class="post-meta">
                    <span class="post-date">📅 {{ post.date | date: "%B %d, %Y" }}</span> | ⏳ {{ post.timetoread }} min
                    read | ✍️ Purusharth Malik
                </div>
            </a>
        </li>
        {% endfor %}
    </ul>
    <div class="archive-link">
        <a href="/archive/">All posts...</a>
    </div>
    <!-- <div style="margin-top: 20px; text-align: center;">
        <p>Page Views:</p>
        <img src="https://visitor-badge.glitch.me/badge?page_id=purusharthmalik.github.io" alt="Visitor Count">
    </div> -->
</div>