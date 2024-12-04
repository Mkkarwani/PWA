// Elements
const selectFileButton = document.getElementById("selectFileButton");
const fileInput = document.getElementById("fileInput");
const backButton = document.getElementById("backButton");
const viewer = document.getElementById("viewer");
const fileList = document.getElementById("fileList");
const pdfCanvas = document.getElementById("pdfCanvas");

// PDF.js configurations
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

// Function to handle reading and previewing a file
function readFile(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const arrayBuffer = event.target.result;
    renderPDF(arrayBuffer);
  };

  reader.onerror = function () {
    alert("Error reading file.");
  };

  reader.readAsArrayBuffer(file);
}

// Function to render PDF using PDF.js
function renderPDF(arrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

  loadingTask.promise
    .then((pdf) => pdf.getPage(1))
    .then((page) => {
      const viewport = page.getViewport({ scale: 1.5 });
      const context = pdfCanvas.getContext("2d");

      pdfCanvas.width = viewport.width;
      pdfCanvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      return page.render(renderContext).promise;
    })
    .then(() => {
      fileList.style.display = "none";
      viewer.style.display = "block";
    })
    .catch((err) => {
      alert("Error rendering PDF: " + err.message);
    });
}

// Event listener for the "Select File" button
selectFileButton.addEventListener("click", () => {
  fileInput.click(); // Trigger the hidden file input
});

// Event listener for the file input
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    readFile(file);
  } else {
    alert("No file selected.");
  }
});

// Event listener for "Back to File Selection" button
backButton.addEventListener("click", () => {
  viewer.style.display = "none";
  fileList.style.display = "block";
});
