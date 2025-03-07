// main.js

// Function to populate dropdown boxes with values 0-255
function setValues() {
    const dropdowns = ['redValue', 'greenValue', 'blueValue', 
                      'cyanValue', 'magentaValue', 'yellowValue'];
    
    dropdowns.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            select.innerHTML = '';
            for (let i = 0; i <= 255; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.text = i;
                select.appendChild(option);
            }
        }
    });

    // Initialize color displays
    if (window.location.href.includes('rgb.html')) {
        displayRGBColor();
    } else if (window.location.href.includes('cmy.html')) {
        displayCMYColor();
    }
}


// Function to display RGB color values

function displayRGBColor() {
    const red = parseInt(document.getElementById('redValue').value);
    const green = parseInt(document.getElementById('greenValue').value);
    const blue = parseInt(document.getElementById('blueValue').value);
    
    const rgbValue = `rgb(${red},${green},${blue})`;
    const rgbFloatValue = `(${(red/255).toFixed(2)}, ${(green/255).toFixed(2)}, ${(blue/255).toFixed(2)})`;
    const hexValue = '#' + 
        red.toString(16).padStart(2, '0') + 
        green.toString(16).padStart(2, '0') + 
        blue.toString(16).padStart(2, '0');
    
    document.getElementById('rgbValue').textContent = rgbValue;
    document.getElementById('rgbFloatValue').textContent = rgbFloatValue;
    document.getElementById('hexValue').textContent = hexValue;
    document.getElementById('colorDisplay').style.backgroundColor = rgbValue;
}

// Function to display CMY color values
function displayCMYColor() {
    const cyan = parseInt(document.getElementById('cyanValue').value);
    const magenta = parseInt(document.getElementById('magentaValue').value);
    const yellow = parseInt(document.getElementById('yellowValue').value);
    
    // Convert CMY to RGB
    const red = 255 - cyan;
    const green = 255 - magenta;
    const blue = 255 - yellow;
    
    const cmyValue = `cmy(${cyan},${magenta},${yellow})`;
    const rgbValue = `rgb(${red},${green},${blue})`;
    const hexValue = '#' + 
        red.toString(16).padStart(2, '0') + 
        green.toString(16).padStart(2, '0') + 
        blue.toString(16).padStart(2, '0');
    
    document.getElementById('cmyValue').textContent = cmyValue;
    document.getElementById('rgbFromCMY').textContent = rgbValue;
    document.getElementById('hexFromCMY').textContent = hexValue;
    document.getElementById('cmyColorDisplay').style.backgroundColor = rgbValue;
}


// Function to generate random colors
function generateRandomColors() {
    const table = document.createElement('table');
    table.className = 'table';
    
    const tbody = document.createElement('tbody');
    
    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        
        const rgbValue = `rgb(${red},${green},${blue})`;
        const hexValue = '#' + 
            red.toString(16).padStart(2, '0') + 
            green.toString(16).padStart(2, '0') + 
            blue.toString(16).padStart(2, '0');
        
        row.innerHTML = `
            <td>
                <div class="color-box" style="background-color: ${rgbValue}"></div>
            </td>
            <td>${rgbValue}</td>
            <td>${hexValue}</td>
        `;
        
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    document.getElementById('randomColorsTable').innerHTML = '';
    document.getElementById('randomColorsTable').appendChild(table);
}

// Function to display web safe colors
function displaySafeColors() {
    const container = document.getElementById('webSafeColors');
    container.innerHTML = '';
    
    const values = [0, 51, 102, 153, 204, 255];
    
    values.forEach(r => {
        values.forEach(g => {
            values.forEach(b => {
                const color = `rgb(${r},${g},${b})`;
                const hex = '#' + 
                    r.toString(16).padStart(2, '0') + 
                    g.toString(16).padStart(2, '0') + 
                    b.toString(16).padStart(2, '0');
                
                const colorBox = document.createElement('div');
                colorBox.className = 'web-safe-color';
                colorBox.style.backgroundColor = color;
                colorBox.innerHTML = `<span>${hex}</span>`;
                
                container.appendChild(colorBox);
            });
        });
    });
}