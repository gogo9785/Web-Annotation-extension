document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get([window.location.href], (result) => {
    const highlights = result[window.location.href] || [];
    highlights.forEach(highlightHTML => {
      const container = document.createElement('div');
      container.innerHTML = highlightHTML;
      const span = container.firstChild;
      document.body.appendChild(span);

      span.addEventListener('click', () => {
        alert(span.getAttribute('data-note'));
      });
    });
  });
});

function highlightSelection(color, style, note, category, date) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.style.backgroundColor = color;
  span.style.cssText += style;
  span.className = 'highlighted';
  span.setAttribute('data-note', note);
  span.setAttribute('data-category', category);
  span.setAttribute('data-date', date);

  range.surroundContents(span);

  span.addEventListener('click', () => {
    alert(note);
  });

  saveHighlightToStorage(span.outerHTML, window.location.href);
}

function saveHighlightToStorage(highlightHTML, url) {
  chrome.storage.sync.get([url], (result) => {
    const highlights = result[url] || [];
    highlights.push(highlightHTML);
    chrome.storage.sync.set({ [url]: highlights });
  });
}

function saveHighlights() {
  const highlights = document.querySelectorAll('.highlighted');
  const highlightsArray = Array.from(highlights).map(span => span.outerHTML);
  chrome.storage.sync.set({ [window.location.href]: highlightsArray });
}

function exportAnnotations() {
  chrome.storage.sync.get([window.location.href], (result) => {
    const highlights = result[window.location.href] || [];
    const docContent = `<!DOCTYPE html>
<html>
<head>
  <title>Exported Annotations</title>
  <style>
    .highlighted {
      cursor: pointer;
      position: relative;
    }
    .highlighted::after {
      content: attr(data-note);
      position: absolute;
      left: 0;
      top: 100%;
      background: rgba(0, 0, 0, 0.75);
      color: #fff;
      padding: 5px;
      border-radius: 5px;
      display: none;
      white-space: pre-wrap;
      z-index: 10;
    }
    .highlighted:hover::after {
      display: block;
    }
  </style>
</head>
<body>
${document.body.innerHTML}
<script>
  const highlights = ${JSON.stringify(highlights)};
  highlights.forEach(highlightHTML => {
    const container = document.createElement('div');
    container.innerHTML = highlightHTML;
    const span = container.firstChild;
    document.body.appendChild(span);
  });
</script>
</body>
</html>`;

    const blob = new Blob([docContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'annotations.html';
    a.click();
    URL.revokeObjectURL(url);
  });
}
