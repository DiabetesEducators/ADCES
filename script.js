document.addEventListener('DOMContentLoaded', () => {
  const colorPicker = document.getElementById('colorPicker');

  // Make all counties clickable
  document.querySelectorAll('path, polygon').forEach(county => {
    // Store the original color of the county
    const originalColor = county.style.fill || county.getAttribute('fill') || 'none';

    county.addEventListener('click', () => {
      const currentColor = county.style.fill || county.getAttribute('fill');
      const selectedColor = colorPicker.value;

      // Toggle between the selected color and the original color
      if (currentColor === selectedColor) {
        // Deselect: Revert to the original color
        county.style.fill = originalColor;
      } else {
        // Select: Apply the new color
        county.style.fill = selectedColor;
      }
    });
  });
});

// This is the download function you already have
function downloadMap() {
  const container = document.querySelector('svg');

  const svgData = new XMLSerializer().serializeToString(container);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const jpegUrl = canvas.toDataURL('image/jpeg');

    const downloadLink = document.createElement('a');
    downloadLink.href = jpegUrl;
    downloadLink.download = 'california-map.jpeg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  img.src = url;
}