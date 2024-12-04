// Elements
const selectFileButton = document.getElementById("selectFileButton");
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

// Event listener for file selection
selectFileButton.addEventListener("click", async () => {
  try {
    // Open file picker dialog
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Encrypted Files",
          accept: {
            "application/octet-stream": [".enc"],
          },
        },
      ],
      multiple: false,
    });

    // Get file object
    const file = await fileHandle.getFile();

    // Read and render the file
    readFile(file);
  } catch (err) {
    alert("No file selected or operation canceled.");
  }
});

// Event listener for "Back to File Selection" button
backButton.addEventListener("click", () => {
  viewer.style.display = "none";
  fileList.style.display = "block";
});
