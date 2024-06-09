document.getElementById('searchButton').addEventListener('click', () => {
  const keyword = document.getElementById('searchKeyword').value.toLowerCase();
  const category = document.getElementById('searchCategory').value.toLowerCase();
  const date = document.getElementById('searchDate').value;

  chrome.storage.sync.get(null, (data) => {
    const results = [];
    for (const url in data) {
      const highlights = data[url];
      if (Array.isArray(highlights)) {
        highlights.forEach(highlightHTML => {
          const container = document.createElement('div');
          container.innerHTML = highlightHTML;
          const span = container.firstChild;
          const spanText = span.innerText.toLowerCase();
          const spanCategory = span.getAttribute('data-category').toLowerCase();
          const spanDate = span.getAttribute('data-date');

          if (
            (keyword && spanText.includes(keyword)) ||
            (category && spanCategory.includes(category)) ||
            (date && spanDate.startsWith(date))
          ) {
            results.push({ url, highlightHTML });
          }
        });
      }
    }

    displayResults(results);
  });
});

function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  results.forEach(result => {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'annotation';
    resultDiv.innerHTML = `<strong>URL:</strong> ${result.url}<br>${result.highlightHTML}`;
    resultsContainer.appendChild(resultDiv);
  });
}
