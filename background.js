chrome.commands.onCommand.addListener((command) => {
  if (command === 'highlight') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: highlightSelectionShortcut
      });
    });
  } else if (command === 'add_note') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: addNoteShortcut
      });
    });
  } else if (command === 'export_annotations') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: exportAnnotations
      });
    });
  }
});

function highlightSelectionShortcut() {
  chrome.storage.sync.get(['highlightColor', 'highlightStyle'], (data) => {
    const highlightColor = data.highlightColor || '#FFFF00';
    const highlightStyle = data.highlightStyle || '';
    const note = '';
    const category = '';
    const date = new Date().toISOString();

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = highlightColor;
    span.style.cssText += highlightStyle;
    span.className = 'highlighted';
    span.setAttribute('data-note', note);
    span.setAttribute('data-category', category);
    span.setAttribute('data-date', date);

    range.surroundContents(span);

    span.addEventListener('click', () => {
      alert(note);
    });

    saveHighlightToStorage(span.outerHTML, window.location.href);
  });
}

function addNoteShortcut() {
  const note = prompt('Enter note:');
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.className = 'highlighted';
  span.setAttribute('data-note', note);
  span.setAttribute('data-category', '');
  span.setAttribute('data-date', new Date().toISOString());

  range.surroundContents(span);

  span.addEventListener('click', () => {
    alert(note);
  });

  saveHighlightToStorage(span.outerHTML, window.location.href);
}
