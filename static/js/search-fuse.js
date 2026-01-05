document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("keyword");
  const input = document.getElementById("keyword-input");
  if (input && keyword) input.value = keyword;

  const form = document.getElementById("search-form");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    const value = input.value.trim();
    if (value) {
      window.location.href = `/search/?keyword=${encodeURIComponent(value)}`;
    }
  });

  if (!keyword) return;

  const jsonURL = "/search/index.json";

  function highlight(text, keyword) {
    if (!text) return "";
    const re = new RegExp(`(${keyword})`, "gi");
    return text.replace(re, '<mark>$1</mark>');
  }

  fetch(jsonURL)
    .then(res => res.json())
    .then(data => {
      const fuse = new Fuse(data, {
        keys: ["title", "summary", "content"],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 1
      });

      const list = document.getElementById("search-results");
      if (!list) return;
      list.innerHTML = "";

      const results = fuse.search(keyword);
      if (results.length === 0) {
        list.innerHTML = `<p class="search-summary">未找到匹配结果</p>`;
        return;
      }

      results.forEach(({ item }) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <article class="search-item">
			<a href="${item.permalink}" class="search-title">
      ${highlight(item.title, keyword)}
    </a>
    <p class="search-summary">
      ${highlight(item.summary || item.content.slice(0, 180), keyword)}…
    </p>
  </article>
        `;
        list.appendChild(li);
      });
    })
    .catch(err => console.error("Failed to load search JSON:", err));
});
