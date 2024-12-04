// Elements
const fileContainer = document.getElementById('fileContainer');
const viewerSection = document.getElementById('viewerSection');
const pdfCanvas = document.getElementById('pdfViewer');
const backToFiles = document.getElementById('backToFiles');

// Files available for download
const files = [
  { id: 1, name: 'example1.enc', url: 'example1.enc' },
  { id: 2, name: 'example2.enc', url: 'example2.enc' },
];

// File paths storage
const storageKey = 'downloadedFiles';
let downloadedFiles = JSON.parse(localStorage.getItem(storageKey)) || {};

// Load files into the list
function loadFiles() {
  fileContainer.innerHTML = '';
  files.forEach((file) => {
    const li = document.createElement('li');
    li.id = `file-${file.id}`;
    li.innerHTML = `
      <span>${file.name}</span>
      <button>${downloadedFiles[file.name] ? 'Read' : 'Download'}</button>
    `;
    fileContainer.appendChild(li);

    // Attach event listener to button
    const button = li.querySelector('button');
    button.addEventListener('click', () => handleFileAction(file));
  });
}

// Handle file download or read action
function handleFileAction(file) {
  if (!downloadedFiles[file.name]) {
    // Download file
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();

    // Simulate storing file path
    downloadedFiles[file.name] = `path/to/downloaded/${file.name}`;
    localStorage.setItem(storageKey, JSON.stringify(downloadedFiles));

    // Update button to "Read"
    document.querySelector(`#file-${file.id} button`).textContent = 'Read';
  } else {
    // Read the file
    readFile(file);
  }
}

// Render PDF using pdf.js
function readFile(file) {
  const filePath = downloadedFiles[file.name];
  if (!filePath) {
    alert('File path not found. Please download the file first.');
    return;
  }

  // Simulate reading the .enc file and rendering it as PDF
  fetch(filePath)
    .then((response) => response.arrayBuffer())
    .then((data) => {
      const typedArray = new Uint8Array(data);
      const loadingTask = pdfjsLib.getDocument({ data: typedArray });

      loadingTask.promise
        .then((pdf) => pdf.getPage(1))
        .then((page) => {
          const viewport = page.getViewport({ scale: 1 });
          const context = pdfCanvas.getContext('2d');
          pdfCanvas.height = viewport.height;
          pdfCanvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          page.render(renderContext);

          // Switch to viewer section
          viewerSection.style.display = 'block';
          document.getElementById('fileList').style.display = 'none';
        })
        .catch((err) => console.error('Error loading PDF:', err));
    });
}

// Handle "Back to Files" button
backToFiles.addEventListener('click', () => {
  viewerSection.style.display = 'none';
  document.getElementById('fileList').style.display = 'block';
});

// Initialize
loadFiles();
