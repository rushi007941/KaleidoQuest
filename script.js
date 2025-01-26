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

function generateTriangles(color1, color2) {
    const triangleTypes = [
        // Right triangle at top-left
        `<path d="M0,0 L50,0 L0,50 Z" fill="${color1}" />`,
        // Right triangle at top-right
        `<path d="M50,0 L100,0 L100,50 Z" fill="${color1}" />`,
        // Right triangle at bottom-right
        `<path d="M100,50 L100,100 L50,100 Z" fill="${color1}" />`,
        // Right triangle at bottom-left
        `<path d="M0,50 L50,100 L0,100 Z" fill="${color1}" />`,
        // Inverted right triangle at top-left
        `<path d="M0,0 L50,50 L0,50 Z" fill="${color1}" />`,
        // Inverted right triangle at top-right
        `<path d="M100,0 L100,50 L50,50 Z" fill="${color1}" />`,
        // Inverted right triangle at bottom-right
        `<path d="M50,50 L100,100 L50,100 Z" fill="${color1}" />`,
        // Inverted right triangle at bottom-left
        `<path d="M0,100 L0,50 L50,50 Z" fill="${color1}" />`
    ];

    const triangleIndex = Math.floor(Math.random() * triangleTypes.length);
    
    return `
        <svg viewBox="0 0 100 100">
            <rect x="0" y="0" width="100" height="100" fill="${color2}" />
            ${triangleTypes[triangleIndex]}
        </svg>
    `;
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
    const colorInputs = document.querySelectorAll('.color-input:not(.deleted) input[type="color"]');
    const colors = Array.from(colorInputs)
        .map(input => input.value)
        .filter(color => color !== '#000000');
    
    if (!colors.length) return;
    
    const patternSelect = document.querySelector('.custom-select');
    const selectedPattern = patternSelect ? patternSelect.value : 'Circle and Quaters';
    
    const gridSizeInput = document.querySelector('.select-input');
    let gridSize = parseInt(gridSizeInput?.value || '4');
    if (isNaN(gridSize) || gridSize < 2) gridSize = 2;
    if (gridSize > 12) gridSize = 12;
    
    const previewContent = document.querySelector('.preview-content');
    if (!previewContent) return;
    
    previewContent.innerHTML = '';
    
    if (selectedPattern === 'Waves') {
        const waveContainer = document.createElement('div');
        waveContainer.className = 'wave-container';
        waveContainer.innerHTML = generateSoundWaves(colors, gridSize);
        previewContent.appendChild(waveContainer);
    } else {
        // For other patterns, keep the grid layout
        const patternContainer = document.createElement('div');
        patternContainer.className = 'pattern-container';
        patternContainer.style.display = 'grid';
        patternContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        try {
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'pattern-cell';
                    
                    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
                    
                    let svg;
                    if (selectedPattern === 'Circle and Quaters') {
                        svg = generateCircleQuarters(shuffledColors[0], shuffledColors[1]);
                    } else if (selectedPattern === 'Triangles') {
                        svg = generateGeometricTriangles(shuffledColors);
                    }
                    
                    cell.innerHTML = svg;
                    cell.style.transform = `rotate(${Math.floor(Math.random() * 4) * 90}deg)`;
                    patternContainer.appendChild(cell);
                }
            }
            previewContent.appendChild(patternContainer);
        } catch (error) {
            console.error('Error generating pattern:', error);
        }
    }
}

function generateGeometricTriangles(colors) {
    const patterns = [
        // Basic triangles
        () => `
            <path d="M0,0 L100,0 L0,100 Z" fill="${colors[0]}" />
            <path d="M100,0 L100,100 L0,100 Z" fill="${colors[1]}" />
        `,
        // Diagonal split
        () => `
            <path d="M0,0 L100,0 L50,50 Z" fill="${colors[0]}" />
            <path d="M100,0 L100,100 L50,50 Z" fill="${colors[1]}" />
            <path d="M0,100 L100,100 L50,50 Z" fill="${colors[0]}" />
            <path d="M0,0 L0,100 L50,50 Z" fill="${colors[1]}" />
        `,
        // Striped triangle
        () => {
            const stripes = [];
            for (let i = 0; i < 10; i++) {
                stripes.push(`
                    <path d="M${i * 10},0 L${(i + 1) * 10},0 L${(i + 1) * 10},${(i + 1) * 10} L${i * 10},${i * 10} Z" 
                          fill="${i % 2 === 0 ? colors[0] : colors[1]}" />
                `);
            }
            return stripes.join('');
        },
        // Corner triangles
        () => `
            <path d="M0,0 L50,0 L0,50 Z" fill="${colors[0]}" />
            <path d="M50,0 L100,0 L100,50 Z" fill="${colors[1]}" />
            <path d="M0,50 L0,100 L50,100 Z" fill="${colors[1]}" />
            <path d="M100,50 L50,100 L100,100 Z" fill="${colors[0]}" />
        `
    ];

    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    return `
        <svg viewBox="0 0 100 100">
            <rect x="0" y="0" width="100" height="100" fill="${colors[2] || '#FFFFFF'}" />
            ${selectedPattern()}
        </svg>
    `;
}

function generateCircleQuarters(color1, color2) {
    return `
        <svg viewBox="0 0 100 100">
            <!-- Top Left Quarter -->
            <path d="M0,0 L50,0 L50,50 L0,50 Z" fill="${color1}" />
            <path d="M0,0 L50,0 A50,50 0 0,1 0,50 Z" fill="${color2}" />
            
            <!-- Top Right Quarter -->
            <path d="M50,0 L100,0 L100,50 L50,50 Z" fill="${color2}" />
            <path d="M100,0 A50,50 0 0,0 50,50 L100,50 Z" fill="${color1}" />
            
            <!-- Bottom Left Quarter -->
            <path d="M0,50 L50,50 L50,100 L0,100 Z" fill="${color2}" />
            <path d="M0,100 A50,50 0 0,0 50,50 L0,50 Z" fill="${color1}" />
            
            <!-- Bottom Right Quarter -->
            <path d="M50,50 L100,50 L100,100 L50,100 Z" fill="${color1}" />
            <path d="M100,100 A50,50 0 0,1 50,50 L100,50 Z" fill="${color2}" />
        </svg>
    `;
}

function generateSoundWaves(colors, density) {
    const waveTypes = {
        sine: (x, freq, amp, phase) => 
            Math.sin(x * freq + phase) * amp,
        
        double: (x, freq, amp, phase) => 
            Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2 + phase) * (amp / 2),
        
        compressed: (x, freq, amp, phase) => 
            Math.sin(x * freq + phase) * amp * Math.exp(-Math.pow((x - 400) / 200, 2)),
        
        ripple: (x, freq, amp, phase) => 
            Math.sin(x * freq + phase) * amp * (1 + Math.sin(x * 0.01) * 0.5)
    };

    const waveTypes_arr = Object.values(waveTypes);
    const selectedWave = waveTypes_arr[Math.floor(Math.random() * waveTypes_arr.length)];
    
    const numWaves = 20 + (density * 5);
    const lines = [];
    
    const baseFreq = 0.01;
    const baseAmp = 20;
    
    // Create color groups for different wave sections
    const colorGroups = Math.ceil(numWaves / colors.length);
    
    for (let i = 0; i < numWaves; i++) {
        const points = [];
        const frequency = baseFreq + (Math.random() * 0.005);
        const amplitude = baseAmp + (Math.random() * 10);
        const phase = i * 0.2;
        
        // Select color based on wave group
        const colorIndex = Math.floor(Math.random() * colors.length);
        const lineColor = colors[colorIndex];
        
        for (let x = 0; x <= 800; x += 1) {
            const y = 100 + selectedWave(x, frequency, amplitude, phase);
            points.push(`${x},${y}`);
        }
        
        lines.push(`
            <polyline 
                points="${points.join(' ')}"
                fill="none"
                stroke="${lineColor}"
                stroke-width="0.5"
                stroke-opacity="${0.1 + (i / numWaves) * 0.9}"
            />
        `);
    }
    
    // Add crossing lines with different colors
    const crossLines = [];
    const numCrossLines = Math.floor(density * 2);
    
    for (let i = 0; i < numCrossLines; i++) {
        const points = [];
        const frequency = baseFreq * 2;
        const amplitude = baseAmp * 0.5;
        const phase = Math.random() * Math.PI * 2;
        
        // Random color for each crossing line
        const crossLineColor = colors[Math.floor(Math.random() * colors.length)];
        
        for (let x = 0; x <= 800; x += 1) {
            const y = 100 + selectedWave(x, frequency, amplitude, phase);
            points.push(`${x},${y}`);
        }
        
        crossLines.push(`
            <polyline 
                points="${points.join(' ')}"
                fill="none"
                stroke="${crossLineColor}"
                stroke-width="0.3"
                stroke-opacity="0.3"
                transform="rotate(${Math.random() * 30 - 15}, 400, 100)"
            />
        `);
    }

    return `
        <svg viewBox="0 0 800 200">
            <g class="wave-group">
                ${lines.join('')}
                ${crossLines.join('')}
            </g>
        </svg>
    `;
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
        background: white;
    }
    
    .wave-container {
        width: 100%;
        margin: 20px auto;
        background: white;
        overflow: hidden;
        padding: 20px;
    }
    
    .wave-container svg {
        width: 100%;
        height: auto;
        display: block;
    }
    
    .wave-group polyline {
        vector-effect: non-scaling-stroke;
    }
`;
document.head.appendChild(style);