// Elements
const fileContainer = document.getElementById("fileContainer");
const viewerSection = document.getElementById("viewerSection");
const pdfCanvas = document.getElementById("pdfViewer");
const backToFiles = document.getElementById("backToFiles");

// Files available for download
const files = [
  { id: 1, name: "example1.enc", url: "example1.enc" },
  { id: 2, name: "example2.enc", url: "example2.enc" },
  { id: 3, name: "example1.enc", url: "example1.enc" }
];

// Load files into the list
function loadFiles() {
  fileContainer.innerHTML = "";
  files.forEach((file) => {
    const li = document.createElement("li");
    li.id = `file-${file.id}`;
    li.innerHTML = `
      <span>${file.name}</span>
      <button data-file="${file.name}" data-url="${file.url}">Download</button>
      <input type="file" accept=".enc" style="display: none;" data-file="${file.name}">
      <button class="read-button" data-file="${file.name}" style="display: none;">Read</button>
    `;
    fileContainer.appendChild(li);

    // Attach event listener to the download button
    const downloadButton = li.querySelector("button[data-url]");
    downloadButton.addEventListener("click", () => handleDownload(file));

    // Attach event listener to the file input for reading
    const fileInput = li.querySelector("input[type='file']");
    fileInput.addEventListener("change", (event) => handleFileSelection(event, file));

    // Attach event listener to the read button
    const readButton = li.querySelector(".read-button");
    readButton.addEventListener("click", () => fileInput.click());
  });
}

// Handle file download
function handleDownload(file) {
  const link = document.createElement("a");
  link.href = file.url;
  link.download = file.name;
  link.click();

  // Enable the "Read" button after download
  const readButton = document.querySelector(`#file-${file.id} .read-button`);
  readButton.style.display = "inline";
}

// Handle file selection and read
function handleFileSelection(event, file) {
  const selectedFile = event.target.files[0];
  if (selectedFile && selectedFile.name === file.name) {
    const reader = new FileReader();

    // Read the .enc file and simulate conversion to .pdf
    reader.onload = function () {
      const arrayBuffer = reader.result;

      // Render the file using PDF.js
      renderPDF(arrayBuffer);
    };

    reader.readAsArrayBuffer(selectedFile);
  } else {
    alert("Please select the correct file.");
  }
}

// Render PDF using pdf.js
function renderPDF(arrayBuffer) {
  const typedArray = new Uint8Array(arrayBuffer);

  const loadingTask = pdfjsLib.getDocument({ data: typedArray });

  loadingTask.promise
    .then((pdf) => pdf.getPage(1))
    .then((page) => {
      const viewport = page.getViewport({ scale: 1 });
      const context = pdfCanvas.getContext("2d");
      pdfCanvas.height = viewport.height;
      pdfCanvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      page.render(renderContext);

      // Show the viewer section
      viewerSection.style.display = "block";
      document.getElementById("fileList").style.display = "none";
    })
    .catch((err) => {
      console.error("Error loading PDF:", err);
    });
}

// Handle "Back to Files" button
backToFiles.addEventListener("click", () => {
  viewerSection.style.display = "none";
  document.getElementById("fileList").style.display = "block";
});

// Initialize
loadFiles();
