const colors = [];

document.getElementById('addColor').addEventListener('click', function() {
    const color = document.getElementById('colorPicker').value;

    // Check if the color is already in the list or if the limit is reached
    if (colors.length < 6 && !colors.includes(color)) {
        colors.push(color);
        updateColorList();
    } else if (colors.includes(color)) {
        alert('This color is already added.');
    } else {
        alert('You can only add up to 6 colors.');
    }
});

function updateColorList() {
    const colorList = document.getElementById('colorList');
    colorList.innerHTML = ''; // Clear existing colors
    colors.forEach((color, index) => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.onclick = () => {
            colors.splice(index, 1); // Remove color from array
            updateColorList(); // Update the displayed list
        };

        colorItem.appendChild(colorBox); // Add color preview box
        colorItem.appendChild(deleteButton);
        colorList.appendChild(colorItem);
    });
}

document.getElementById('generatePattern').addEventListener('click', function() {
    const patternType = document.getElementById('patternType').value;
    const gridSize = parseInt(document.getElementById('gridSize').value);

    // Validate grid size
    if (isNaN(gridSize) || gridSize < 1 || gridSize > 10) {
        alert('Please enter a grid size between 1 and 10.');
        return;
    }

    let svgContent = '';

    // Generate SVG based on selected pattern type and colors
    if (patternType === 'circles') {
        svgContent = generateCircles(gridSize);
    } else if (patternType === 'triangles') {
        svgContent = generateTriangles(gridSize);
    } else if (patternType === 'waves') {
        svgContent = generateWaves(gridSize);
    }

    document.getElementById('patternOutput').innerHTML = svgContent;
});

function generateCircles(gridSize) {
    let circles = '';
    const radius = 20;
    const spacing = 50;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const color = colors[(i + j) % colors.length]; // Cycle through colors
            circles += `<circle cx="${spacing * i + radius}" cy="${spacing * j + radius}" r="${radius}" fill="${color}" />`;
        }
    }

    return `<svg width="100%" height="100%">${circles}</svg>`;
}

function generateTriangles(gridSize) {
    let triangles = '';
    const height = 40;
    const spacing = 50;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const color = colors[(i + j) % colors.length]; // Cycle through colors
            const x = spacing * i;
            const y = spacing * j + height;
            triangles += `<polygon points="${x},${y} ${x + 20},${y - height} ${x + 40},${y}" fill="${color}" />`;
        }
    }

    return `<svg width="100%" height="100%">${triangles}</svg>`;
}

function generateWaves(gridSize) {
    let waves = '';
    const spacing = 50;

    for (let i = 0; i < gridSize; i++) {
        const xOffset = spacing * i;
        const color = colors[i % colors.length]; // Cycle through colors
        waves += `<path d="M${xOffset},50 Q${xOffset + 25},0 ${xOffset + 50},50 T${xOffset + 100},50" fill="${color}" />`;
    }

    return `<svg width="100%" height="100%">${waves}</svg>`;
}

document.getElementById('downloadSVG').addEventListener('click', function() {
    const svg = document.getElementById('patternOutput').innerHTML;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pattern.svg';
    a.click();
});

document.getElementById('copySVG').addEventListener('click', function() {
    const svg = document.getElementById('patternOutput').innerHTML;
    navigator.clipboard.writeText(svg).then(() => {
        alert('SVG copied to clipboard!');
    });
});

// Function to update hex code
function updateHexCode(colorPicker, hexInput) {
    hexInput.value = colorPicker.value.toUpperCase();
}

// Function to initialize a color input
function initializeColorInput(colorInput) {
    const colorPicker = colorInput.querySelector('input[type="color"]');
    const hexInput = colorInput.querySelector('input[type="text"]');
    
    colorPicker.addEventListener('input', () => updateHexCode(colorPicker, hexInput));
    colorPicker.addEventListener('change', () => updateHexCode(colorPicker, hexInput));
    
    updateHexCode(colorPicker, hexInput);
}

// Function to add new color
function addNewColor() {
    const colorList = document.querySelector('.color-list');
    const defaultColor = '#000000';
    
    const newColor = document.createElement('div');
    newColor.className = 'color-input';
    newColor.innerHTML = `
        <input type="color" value="${defaultColor}">
        <input type="text" value="${defaultColor}" readonly>
        <button class="delete-color" onclick="this.parentElement.remove()">×</button>
    `;
    
    colorList.appendChild(newColor);
    initializeColorInput(newColor);
}

// Initialize all color inputs when page loads
window.onload = function() {
    document.querySelectorAll('.color-input').forEach(input => {
        initializeColorInput(input);
    });
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listener to generate button
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generatePattern);
    }
});

function generatePattern() {
    // Get only the visible color inputs (not deleted ones)
    const colorInputs = document.querySelectorAll('.color-input:not(.deleted) input[type="color"]');
    const colors = Array.from(colorInputs)
        .map(input => input.value)
        .filter(color => color !== '#000000'); // Exclude black color if not explicitly selected
    
    // Validate colors
    if (!colors.length) {
        console.error('No colors found');
        return;
    }
    
    const gridSizeInput = document.querySelector('.select-input');
    if (!gridSizeInput) {
        console.error('Grid size input not found');
        return;
    }
    
    let gridSize = parseInt(gridSizeInput.value);
    
    if (isNaN(gridSize) || gridSize < 2) {
        gridSize = 2;
    } else if (gridSize > 12) {
        gridSize = 12;
    }
    
    const previewContent = document.querySelector('.preview-content');
    if (!previewContent) {
        console.error('Preview content container not found');
        return;
    }
    
    // Clear previous pattern
    previewContent.innerHTML = '';
    
    const patternContainer = document.createElement('div');
    patternContainer.className = 'pattern-container';
    
    patternContainer.style.display = 'grid';
    patternContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    try {
        // Create pattern matrix
        const matrix = Array(gridSize).fill().map((_, i) => 
            Array(gridSize).fill().map((_, j) => {
                const rotation = Math.floor(Math.random() * 4) * 90;
                const colorCount = colors.length;
                
                // Ensure we only use available colors
                const colorIndex = (i + j) % colorCount;
                return {
                    color: colors[colorIndex],
                    rotation
                };
            })
        );
        
        // Generate cells
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'pattern-cell';
                
                const cellColor = colors[(i + j) % colors.length];
                const nextColor = colors[((i + j + 1) % colors.length)];
                
                const svg = `
                    <svg viewBox="0 0 100 100">
                        <!-- Top Left Quarter -->
                        <path d="M0,0 L50,0 L50,50 L0,50 Z" fill="${cellColor}" />
                        <path d="M0,0 L50,0 A50,50 0 0,1 0,50 Z" fill="${nextColor}" />
                        
                        <!-- Top Right Quarter -->
                        <path d="M50,0 L100,0 L100,50 L50,50 Z" fill="${nextColor}" />
                        <path d="M100,0 A50,50 0 0,0 50,50 L100,50 Z" fill="${cellColor}" />
                        
                        <!-- Bottom Left Quarter -->
                        <path d="M0,50 L50,50 L50,100 L0,100 Z" fill="${nextColor}" />
                        <path d="M0,100 A50,50 0 0,0 50,50 L0,50 Z" fill="${cellColor}" />
                        
                        <!-- Bottom Right Quarter -->
                        <path d="M50,50 L100,50 L100,100 L50,100 Z" fill="${cellColor}" />
                        <path d="M100,100 A50,50 0 0,1 50,50 L100,50 Z" fill="${nextColor}" />
                    </svg>
                `;
                
                cell.innerHTML = svg;
                cell.style.transform = `rotate(${matrix[i][j].rotation}deg)`;
                patternContainer.appendChild(cell);
            }
        }
        
        previewContent.appendChild(patternContainer);
        
    } catch (error) {
        console.error('Error generating pattern:', error);
    }
}

// Add or update the CSS
const style = document.createElement('style');
style.textContent = `
    .pattern-container {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        aspect-ratio: 1;
        gap: 0;
    }
    
    .pattern-cell {
        width: 100%;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
    }
    
    .pattern-cell svg {
        width: 100%;
        height: 100%;
    }

    .grid-size {
        width: 100%;
        padding: 16px 20px;
        background: #FFFFFF;
        border: 1px solid #D0D5DD;
        border-radius: 12px;
        font-family: Inter;
        font-size: 32px;
        font-weight: 500;
        color: #13233B;
        appearance: none;
    }

    .grid-size:focus {
        outline: none;
        border-color: #2E90FA;
    }

    /* Remove number input spinners */
    .grid-size::-webkit-inner-spin-button,
    .grid-size::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .grid-size {
        -moz-appearance: textfield;
    }

    .card-title {
        font-family: Inter;
        font-size: 24px;
        font-weight: 600;
        color: #13233B;
        margin-bottom: 8px;
    }

    .card-subtitle {
        font-family: Inter;
        font-size: 14px;
        color: #4D5761;
        margin-bottom: 24px;
    }

    .input-container {
        position: relative;
        margin-bottom: 16px;
    }

    .select-input[type="number"] {
        width: 100%;
        height: auto;
        padding: 12px 16px;
        background: #FFFFFF;
        border: 1px solid #D0D5DD;
        border-radius: 12px;
        color: #13233B;
        font-family: Inter;
        font-size: 16px;
        font-weight: 400;
        appearance: none;
        cursor: pointer;
        outline: none;
    }

    .select-input[type="number"]::-webkit-inner-spin-button,
    .select-input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .select-input[type="number"] {
        -moz-appearance: textfield;
    }

    .select-input:focus {
        outline: none;
        border-color: #2E90FA;
    }

    .generate-btn {
        width: 100%;
        padding: 10px 18px;
        background: #2E90FA;
        border: none;
        border-radius: 8px;
        color: white;
        font-family: Inter;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-top: 16px;
    }

    .generate-btn:hover {
        background: #1B7CD3;
    }

    .generate-btn:active {
        background: #1570C4;
    }
`;
document.head.appendChild(style);