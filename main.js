const images = Array.from(document.querySelectorAll("img"));
const infoContainers = Array.from(document.querySelectorAll(".image-info"));

// Obtener información de la imagen
async function getImageInfo(url) {
  return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = async () => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const format = url.split(".").pop();
        const dimensions = {
          width: img.width,
          height: img.height,
        };
        const alt = img.alt;
        const size = blob.size;

        resolve({ format, dimensions, alt, size });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = reject;
  });
}

// Calcular el tamaño original de la imagen en KB
function calculateOriginalSize(width, height, format) {
  let bytesPerPixel = 3; // Asumiendo un formato RGB
  if (format === 'png') {
    bytesPerPixel = 4; // PNG tiene un canal alfa
  }
  const originalSizeInKB = ((width * height * bytesPerPixel) / 1024).toFixed(2);
  return originalSizeInKB;
}

// Mostrar información de la imagen
function displayImageInfo(url, container) {
  getImageInfo(url)
    .then((info) => {
      const formatElement = document.createElement("p");
      formatElement.textContent = `Formato: ${info.format}`;
      container.appendChild(formatElement);

      const dimensionsElement = document.createElement("p");
      dimensionsElement.textContent = `Dimensiones: ${info.dimensions.width}x${info.dimensions.height}`;
      container.appendChild(dimensionsElement);

      const altElement = document.createElement("p");
      altElement.textContent = `Alt: ${info.alt}`;
      container.appendChild(altElement);

      const sizeInKB = (info.size / 1024).toFixed(2);
      const sizeElement = document.createElement("p");
      sizeElement.textContent = `Tamaño: ${sizeInKB} KB`;
      container.appendChild(sizeElement);

      // Calcular tamaño original de la imagen
      const originalSizeInKB = calculateOriginalSize(info.dimensions.width, info.dimensions.height, info.format);

      // Calcular y mostrar porcentaje de reducción
      const reductionPercentage = (((originalSizeInKB - sizeInKB) / originalSizeInKB) * 100).toFixed(2);
      const reductionElement = document.createElement("p");
      reductionElement.textContent = `Porcentaje de reducción: ${reductionPercentage}%`;
      container.appendChild(reductionElement);
    })
    .catch(console.error);
}

// Mostrar información para cada imagen
images.forEach((img, i) => {
  displayImageInfo(img.src, infoContainers[i]);
});
