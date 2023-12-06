
document.addEventListener('DOMContentLoaded', function () {
    const ctrl = document.getElementById('ctrl');
    const imageContainer = document.getElementById('image-container');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const totalImagesDisplay = document.getElementById('total-images');
    const showStatsButton = document.getElementById('showStatsButton');
    const statsContainer = document.getElementById('statsContainer');

    let currentIndex = 0;
    let imageStats = {};

    function displayImages(event) {
        const files = event.target.files;
        imageContainer.innerHTML = '';

        for (let i = 0; i < files.length; i++) {
            const image = document.createElement('img');
            image.src = URL.createObjectURL(files[i]);
            imageContainer.appendChild(image);

            const statsContainer = document.createElement('div');
            statsContainer.id = `stats-container-${i}`;
            imageContainer.appendChild(statsContainer);

            calculateImageStats(files[i], i);
        }

        currentIndex = 0;
        showImage(currentIndex);
        // Update the total number of images
        updateTotalImages(files.length);
    }

    function showImage(index) {
        const images = document.querySelectorAll('#image-container img');
        images.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });

        const statsContainer = document.getElementById(`stats-container-${index}`);
        updateImageStats(index, imageStats[index], statsContainer);
    }

    function showNext() {
        if (currentIndex < imageContainer.childElementCount - 1) {
            currentIndex++;
            showImage(currentIndex);
        }
    }

    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        }
    }

    function updateTotalImages(total) {
        totalImagesDisplay.textContent = `Total Images: ${total}`;
    }

    async function calculateImageStats(file, index) {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        await image.decode();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0, image.width, image.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let minValue = 255;
        let maxValue = 0;
        let sum = 0;
        let sumSquared = 0;
        const histogramData = Array(256).fill(0);

        for (let j = 0; j < data.length; j += 4) {
            const pixelValue = data[j];

            minValue = Math.min(minValue, pixelValue);
            maxValue = Math.max(maxValue, pixelValue);
            sum += pixelValue;
            sumSquared += pixelValue * pixelValue;

            histogramData[pixelValue]++;
        }

        const mean = sum / (data.length / 4);
        const variance = sumSquared / (data.length / 4) - mean * mean;
        const stdDeviation = Math.sqrt(variance);

        const stats = {
            minValue,
            maxValue,
            mean,
            stdDeviation,
            histogramData,
        };

        imageStats[index] = stats;
    }

    function updateImageStats(index, stats, statsContainer) {
        statsContainer.innerHTML = `
            <p>Min Value: ${stats.minValue}</p>
            <p>Max Value: ${stats.maxValue}</p>
            <p>Mean: ${stats.mean}</p>
            <p>Standard Deviation: ${stats.stdDeviation}</p>
            <br>
            <div id="histogram-${index}"></div>
        `;
        drawHistogram(`histogram-${index}`, stats.histogramData);
    }

    function drawHistogram(containerId, histogramData) {
        const trace1 = {
            type: 'bar',
            x: Array.from({ length: 256 }, (_, i) => i),
            y: histogramData,
            marker: {
                color: '#C8A2C8',
                line: {
                    width: 2.5,
                },
            },
        };

        const data = [trace1];

        const layout = {
            title: 'Histogram',
            font: { size: 18 },
        };

        const config = { responsive: true };

        // Create a new Plotly chart
        Plotly.newPlot(containerId, data, layout, config);
    }

    ctrl.addEventListener('change', function (event) {
        const files = event.target.files;
        imageStats = {}; // Reset imageStats
        for (let i = 0; i < files.length; i++) {
            calculateImageStats(files[i], i);
        }
    });

    nextButton.addEventListener('click', showNext);
    prevButton.addEventListener('click', showPrev);
    showStatsButton.addEventListener('click', () => {
        const statsContainer = document.getElementById('statsContainer');
        updateImageStats(currentIndex, imageStats[currentIndex], statsContainer);
    });
});
