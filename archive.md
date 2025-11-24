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
    background: var(--card-bg, #ffffff);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  @media (min-width: 768px) {
    .post-list-item {
        flex-direction: row;
        align-items: start;
    }
  }

  .post-list-item:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  }

  .post-image {
    flex-shrink: 0;
    width: 100%;
    max-width: 250px;
    height: 180px;
    border-radius: 8px;
    overflow: hidden;
  }

  .post-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .post-list-item:hover .post-image img {
    transform: scale(1.05);
  }

  .post-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .post-excerpt img {
      display: none;
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
  
</style>

<ul class="post-list">
    {% for post in site.posts %}
      <li class="post-list-item" onclick="window.location='{{ post.url }}'">
        {% if post.image %}
        <div class="post-image">
            <img src="{{ post.image | relative_url }}" alt="{{ post.title }}">
        </div>
        {% endif %}
        <div class="post-content">
            <div class="post-title">{{ post.title }}</div>
            <div class="post-excerpt">{{ post.excerpt }}</div>
            <div class="post-meta">
              <span class="post-date">📅 {{ post.date | date: "%B %d, %Y" }}</span> | ⏳ {{ post.timetoread }} min read | ✍️ Purusharth Malik
            </div>
        </div>
      </li>
    {% endfor %}
</ul>