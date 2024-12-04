// Elements
const fileList = document.getElementById("fileList");
const viewer = document.getElementById("viewer");
const pdfCanvas = document.getElementById("pdfCanvas");
const backButton = document.getElementById("backButton");
const fileButtons = document.querySelectorAll(".read-button");

// PDF.js configurations
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

// Function to handle reading and previewing a file
function readFile(fileName) {
  const downloadPath = `${navigator.storage.getDirectory}/Download/${fileName}`;

  fetch(downloadPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("File not found.");
      }
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      renderPDF(arrayBuffer);
    })
    .catch((error) => {
      alert("Error reading file: " + error.message);
    });
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

// Event listener for "Read" buttons
fileButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const fileName = button.dataset.file.replace(".enc", ".pdf");
    readFile(fileName);
  });
});

// Event listener for "Back to Files" button
backButton.addEventListener("click", () => {
  viewer.style.display = "none";
  fileList.style.display = "block";
});
