document.addEventListener('DOMContentLoaded', function() {
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

if (!searchInput || !searchResults) {
return;
}

// 加载索引文件
fetch('/index.json')
.then(response => response.json())
.then(data => {
searchInput.addEventListener('input', function() {
const query = this.value.trim().toLowerCase();
searchResults.innerHTML = '';

if (query.length < 2) {
return;
}

const results = data.filter(item => {
const title = item.title ? item.title.toLowerCase() : '';
const content = item.content ? item.content.toLowerCase() : '';
return title.includes(query) || content.includes(query);
});

if (results.length === 0) {
searchResults.innerHTML = '<p>未找到相关结果</p>';
return;
}

results.forEach(result => {
const resultElement = document.createElement('article');
resultElement.className = 'search-result-item';
resultElement.innerHTML = `
<h3><a href="${result.permalink}">${result.title}</a></h3>
<p>${result.content.substring(0, 150)}...</p>
`;
searchResults.appendChild(resultElement);
});
});
})
.catch(error => {
console.error('Error loading search index:', error);
});
});
