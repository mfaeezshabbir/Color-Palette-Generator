const solidColorButton = document.querySelector("#solid-color-button");
const gradientColorButton = document.querySelector("#gradient-color-button");
const gradientOptions = document.querySelector("#gradient-options");
const generateGradientButton = document.querySelector(
  "#generate-gradient-button"
);
const colorTableBody = document.querySelector("#color-table tbody");

// Toggle dark mode when checkbox is clicked
const darkModeToggle = document.getElementById("dark-mode-toggle");

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});

solidColorButton.addEventListener("click", () => {
  showGradientOptions(false);
  generateSolidColor();
});

gradientColorButton.addEventListener("click", () => {
  showGradientOptions(true);
});

generateGradientButton.addEventListener("click", () => {
  const isRadial = document.querySelector("#gradient-type-radial").checked;
  const numColors = isRadial
    ? parseInt(document.querySelector("#num-colors-radial").value)
    : parseInt(document.querySelector("#num-colors-gradient").value);
  if (isRadial) {
    generateRadialGradient(numColors);
  } else {
    generateLinearGradient(numColors);
  }
});

function showGradientOptions(show) {
  if (show) {
    gradientOptions.style.display = "block";
  } else {
    gradientOptions.style.display = "none";
  }
}

function generateSolidColor() {
  const color = generateRandomColor();
  const preview = document.querySelector(".pen-preview");
  preview.style.background = color;
  colorTableBody.innerHTML = "";
  const row = createColorTableRow(1, color);
  colorTableBody.appendChild(row);
}

function generateLinearGradient(numColors) {
  const preview = document.querySelector(".pen-preview");
  const gradientColors = generateRandomColors(numColors);
  preview.style.background = `linear-gradient(to right, ${gradientColors.join(
    ", "
  )})`;
  colorTableBody.innerHTML = "";
  for (let i = 0; i < numColors; i++) {
    const row = createColorTableRow(i + 1, gradientColors[i]);
    colorTableBody.appendChild(row);
  }
}

function generateRadialGradient(numColors) {
  const preview = document.querySelector(".pen-preview");
  const gradientColors = generateRandomColors(numColors);
  preview.style.background = `radial-gradient(circle, ${gradientColors.join(
    ", "
  )})`;
  colorTableBody.innerHTML = "";
  for (let i = 0; i < numColors; i++) {
    const row = createColorTableRow(i + 1, gradientColors[i]);
    colorTableBody.appendChild(row);
  }
}

function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateRandomColors(numColors) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(generateRandomColor());
  }
  return colors;
}

function createColorTableRow(index, color) {
  const row = document.createElement("tr");

  const colorCell = document.createElement("td");
  const colorPreview = document.createElement("div");
  colorPreview.classList.add("color-preview");
  colorPreview.style.backgroundColor = color;
  colorCell.appendChild(colorPreview);
  row.appendChild(colorCell);

  const hexCell = document.createElement("td");
  const hexSpan = document.createElement("span");
  hexSpan.textContent = color;
  hexSpan.classList.add("color-code");
  hexCell.appendChild(hexSpan);
  hexCell.setAttribute("title", "Click to Copy");
  row.appendChild(hexCell);

  const rgbaCell = document.createElement("td");
  const rgbaValue = hexToRGBA(color);
  const rgbaSpan = document.createElement("span");
  rgbaSpan.textContent = rgbaValue;
  rgbaSpan.classList.add("color-code");
  rgbaCell.appendChild(rgbaSpan);
  rgbaCell.setAttribute("title", "Click to Copy");
  row.appendChild(rgbaCell);

  const cmykCell = document.createElement("td");
  const cmykValue = rgbaToCMYK(rgbaValue);
  const cmykSpan = document.createElement("span");
  cmykSpan.textContent = cmykValue;
  cmykSpan.classList.add("color-code");
  cmykCell.appendChild(cmykSpan);
  cmykCell.setAttribute("title", "Click to Copy");
  row.appendChild(cmykCell);

  return row;
}

function hexToRGBA(hex) {
  const bigint = parseInt(hex.substring(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, 1)`;
}

function rgbaToCMYK(rgba) {
  const rgbaValues = rgba.match(/\d+/g).map(Number);
  const r = rgbaValues[0] / 255;
  const g = rgbaValues[1] / 255;
  const b = rgbaValues[2] / 255;
  const k = Math.min(1 - r, 1 - g, 1 - b);
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return `C: ${Math.round(c * 100)}% M: ${Math.round(m * 100)}% Y: ${Math.round(
    y * 100
  )}% K: ${Math.round(k * 100)}%`;
}
// Get the color table element
const colorTable = document.querySelector("#color-table");

function showNotification(message, color) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.backgroundColor = color;
  notification.classList.add("show");

  // Remove the notification after 2 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

function copyColorCode(code) {
  const tempInput = document.createElement("input");
  tempInput.setAttribute("value", code);
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  const isDarkColor = isColorDark(code);
  const notification = document.getElementById("notification");
  notification.textContent = `Copied: ${code}`;
  notification.style.color = isDarkColor ? "#ffffff" : "#000000";
  notification.style.backgroundColor = isDarkColor ? "#000000" : "#ffffff";
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

function isColorDark(colorCode) {
  // Convert the color code to RGB values
  const rgb = hexToRgb(colorCode);

  // Calculate the perceived brightness of the color
  // using the formula: (R * 299 + G * 587 + B * 114) / 1000
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

  // Return true if the brightness is less than or equal to 127 (dark), false otherwise
  return brightness <= 127;
}

function hexToRgb(hex) {
  // Remove the '#' character if present
  hex = hex.replace("#", "");

  // Parse the hexadecimal values to decimal
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB values as an object
  return { r, g, b };
}

// Add click event listener to table cells
colorTable.addEventListener("click", (event) => {
  const clickedCell = event.target.closest("td");
  if (clickedCell) {
    const colorCode = clickedCell.textContent.trim();
    if (colorCode) {
      copyColorCode(colorCode);
    }
  }
});

// Initial generation
generateSolidColor();
