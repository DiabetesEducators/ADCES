document.addEventListener('DOMContentLoaded', () => {
  const colorPicker = document.getElementById('colorPicker');

  // Make all existing counties or shapes clickable to toggle color
  document.querySelectorAll('path, polygon').forEach(element => {
    const originalColor = element.style.fill || element.getAttribute('fill') || 'none';

    element.addEventListener('click', () => {
      const currentColor = element.style.fill || element.getAttribute('fill');
      const selectedColor = colorPicker.value;

      if (currentColor === selectedColor) {
        element.style.fill = originalColor;
      } else {
        element.style.fill = selectedColor;
      }
    });
  });
});

function downloadMap() {
  const svg = document.querySelector('svg');
  const svgData = new XMLSerializer().serializeToString(svg);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Force 1080p resolution
  canvas.width = 1238.4;
  canvas.height = 1080;

  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    // Clear background (optional: white)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fit SVG proportionally into 1920x1080
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const jpegUrl = canvas.toDataURL('image/jpeg');

    const downloadLink = document.createElement('a');
    downloadLink.href = jpegUrl;
    downloadLink.download = 'california-map-1080p.jpeg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  img.src = url;
}


function addCustomText() {
  const text = document.getElementById('customText').value.trim();
  const size = document.getElementById('fontSize').value || 40;
  const color = "#000000"; // Always black text

  if (!text) {
    alert("Please enter some text.");
    return;
  }

  const svg = document.querySelector('svg');
  const svgText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  svgText.setAttribute("x", 100);
  svgText.setAttribute("y", 100);
  svgText.setAttribute("font-family", "'Microsoft Himalaya', sans-serif");
  svgText.setAttribute("font-size", size);
  svgText.setAttribute("fill", color);
  svgText.setAttribute("cursor", "move");
  svgText.textContent = text;

  makeTextDraggable(svgText);
  svg.appendChild(svgText);
}

function makeTextDraggable(el) {
  let isDragging = false;
  let offsetX, offsetY;

  el.addEventListener('mousedown', function (e) {
    isDragging = true;
    offsetX = e.offsetX - parseFloat(el.getAttribute('x'));
    offsetY = e.offsetY - parseFloat(el.getAttribute('y'));
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      const svg = el.ownerSVGElement;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

      el.setAttribute('x', svgP.x - offsetX);
      el.setAttribute('y', svgP.y - offsetY);
    }
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
  });
}

function addPresetBubble() {
  const svg = document.querySelector('svg');
  const color = document.getElementById('colorPicker').value;

  // Create group container
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("transform", "translate(100, 100)");

  // Outer path (black outline)
  const outerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  outerPath.setAttribute("d", "M30.4,1.6c-38.6.4-39.4,61.8,2,61.8,41.5,0,39.8-62.3-2-61.8Z");
  outerPath.setAttribute("fill", "#000"); // fixed dark border

  // Inner path (this is what should be colorable)
  const innerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  innerPath.setAttribute("d", "M30.5,2.8c-37.1.4-37.9,59.5,2,59.5,39.9,0,38.3-59.9-2-59.5Z");
  innerPath.setAttribute("fill", color);

  // Make inner shape clickable to change color
  innerPath.addEventListener("click", () => {
    const newColor = document.getElementById("colorPicker").value;
    innerPath.setAttribute("fill", newColor);
  });

  group.appendChild(outerPath);
  group.appendChild(innerPath);

  makeGroupDraggable(group);
  svg.appendChild(group);
}

function makeGroupDraggable(group) {
  let isDragging = false;
  let startX, startY, offsetX = 0, offsetY = 0;

  group.addEventListener('mousedown', function (e) {
    isDragging = true;
    const transform = group.getAttribute('transform');
    const match = /translate\(([-\d.]+),\s*([-\d.]+)\)/.exec(transform);
    offsetX = parseFloat(match?.[1] || 0);
    offsetY = parseFloat(match?.[2] || 0);
    startX = e.clientX;
    startY = e.clientY;
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newX = offsetX + dx;
      const newY = offsetY + dy;
      group.setAttribute('transform', `translate(${newX}, ${newY})`);
    }
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
  });
}
