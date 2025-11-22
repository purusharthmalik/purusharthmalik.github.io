---
layout: default
title: Resume
permalink: /resume/
---

<style>
.resume-wrapper{max-width:900px;margin:40px auto;padding:20px}
.resume-actions{margin-bottom:12px}
.resume-actions a{color:var(--accent);text-decoration:none}
</style>

<div class="resume-wrapper">
  <h1>Resume</h1>
  <p class="resume-actions">
    <a href="{{ '/assets/resume.pdf' | relative_url }}" download>Download PDF</a>
  </p>

  <object data="{{ '/assets/resume.pdf' | relative_url }}" type="application/pdf" width="100%" height="900">
    <p>Unable to display the resume. <a href="{{ '/assets/resume.pdf' | relative_url }}">Download the resume</a>.</p>
  </object>
</div>
