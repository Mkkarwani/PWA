// Elements
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const pageNumSpan = document.getElementById("pageNum");
const pageCountSpan = document.getElementById("pageCount");

let pdfDoc = null;
let currentPage = 1;

// Function to render a specific page
function renderPage(pageNumber) {
  pdfDoc.getPage(pageNumber).then((page) => {
    const viewport = page.getViewport({ scale: 1.5 });
    const context = pdfCanvas.getContext("2d");

    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    return page.render(renderContext).promise;
  });
}

// Function to load the PDF and initialize navigation
function loadPDF(arrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

  loadingTask.promise
    .then((pdf) => {
      pdfDoc = pdf;
      pageCountSpan.textContent = pdf.numPages;
      renderPage(currentPage);
    })
    .catch((err) => {
      alert("Error loading PDF: " + err.message);
    });
}

// Event listener for "Previous Page" button
prevPageButton.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage -= 1;
  pageNumSpan.textContent = currentPage;
  renderPage(currentPage);
});

// Event listener for "Next Page" button
nextPageButton.addEventListener("click", () => {
  if (currentPage >= pdfDoc.numPages) return;
  currentPage += 1;
  pageNumSpan.textContent = currentPage;
  renderPage(currentPage);
});

// Modified "readFile" function to use "loadPDF"
function readFile(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const arrayBuffer = event.target.result;
    loadPDF(arrayBuffer);
  };

  reader.onerror = function () {
    alert("Error reading file.");
  };

  reader.readAsArrayBuffer(file);
}
