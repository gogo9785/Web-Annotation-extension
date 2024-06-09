document.getElementById('saveButton').addEventListener('click', () => {
  const highlightColor = document.getElementById('highlightColor').value;
  const highlightStyle = document.getElementById('highlightStyle').value;
  chrome.storage.sync.set({
    highlightColor: highlightColor,
    highlightStyle: highlightStyle
  }, () => {
    alert('Highlight styles saved!');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['highlightColor', 'highlightStyle'], (data) => {
    if (data.highlightColor) {
      document.getElementById('highlightColor').value = data.highlightColor;
    }
    if (data.highlightStyle) {
      document.getElementById('highlightStyle').value = data.highlightStyle;
    }
  });
});
