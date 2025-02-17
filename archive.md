---
layout: page
title: Archive
permalink: /archive/
---
<style>

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
  
</style>

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