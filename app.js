let currentPage = 1;
let pdfDoc = null;

function handleFileSelection(event) {
    const file = event.target.files[0];

    if (!file) return;

    // Rename the file extension from .enc to .pdf
    const renamedFile = new File([file], file.name.replace(/\.enc$/, '.pdf'), { type: 'application/pdf' });

    // Use FileReader to read the file as Data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        const pdfData = e.target.result;

        // Load the PDF using PDF.js
        pdfjsLib.getDocument({data: pdfData}).promise.then(function(pdf) {
            pdfDoc = pdf;
            renderPage(currentPage);
        });
    };

    reader.readAsArrayBuffer(renamedFile);
}

function renderPage(pageNum) {
    pdfDoc.getPage(pageNum).then(function(page) {
        const canvas = document.getElementById('pdfCanvas');
        const ctx = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
    });
}

function goToPreviousPage() {
    if (currentPage <= 1) return;
    currentPage--;
    renderPage(currentPage);
}

function goToNextPage() {
    if (currentPage >= pdfDoc.numPages) return;
    currentPage++;
    renderPage(currentPage);
}

// Disable right-click to prevent download option
document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});
