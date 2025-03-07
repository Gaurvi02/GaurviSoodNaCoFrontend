// script.js

// Function to populate dropdown values from 0 to 255
function setValues() {
    const dropdowns = document.querySelectorAll('select');
    dropdowns.forEach(dropdown => {
        for (let i = 0; i <= 255; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            dropdown.appendChild(option);
        }
    });
}

// Function to change RGB text colors dynamically
function rgb() {
    const rgbText = document.querySelectorAll('.rgb-text span');
    const colors = ['red', 'green', 'blue'];
    rgbText.forEach((letter, index) => {
        letter.style.color = colors[index % colors.length];
    });
}

// Function to change CMY text colors dynamically
function cmy() {
    const cmyText = document.querySelectorAll('.cmy-text span');
    const colors = ['cyan', 'magenta', 'yellow'];
    cmyText.forEach((letter, index) => {
        letter.style.color = colors[index % colors.length];
    });
}

// Function to display RGB color values
function displayRGBColor() {
    const red = document.getElementById('red').value;
    const green = document.getElementById('green').value;
    const blue = document.getElementById('blue').value;

    const floatValues = `(${(red / 255).toFixed(2)}, ${(green / 255).toFixed(2)}, ${(blue / 255).toFixed(2)})`;
    const hexValues = `#${parseInt(red).toString(16).padStart(2, '0')}${parseInt(green).toString(16).padStart(2, '0')}${parseInt(blue).toString(16).padStart(2, '0')}`;

    document.getElementById('float-values').textContent = floatValues;
    document.getElementById('hex-values').textContent = hexValues;
    document.getElementById('color-display').style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
}

// Function to display CMY color values
function displayCMYColor() {
    const cyan = document.getElementById('cyan').value;
    const magenta = document.getElementById('magenta').value;
    const yellow = document.getElementById('yellow').value;

    const r = 255 - cyan;
    const g = 255 - magenta;
    const b = 255 - yellow;

    const floatValues = `(${(r / 255).toFixed(2)}, ${(g / 255).toFixed(2)}, ${(b / 255).toFixed(2)})`;
    const hexValues = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    document.getElementById('float-values').textContent = floatValues;
    document.getElementById('hex-values').textContent = hexValues;
    document.getElementById('color-display').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// Function to generate and display random colors
function generateRandomColors() {
    const table = document.getElementById('random-color-table');
    table.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>rgb(${r}, ${g}, ${b})</td>
            <td>#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}</td>
            <td style="background-color: rgb(${r}, ${g}, ${b});"></td>
        `;
        table.appendChild(row);
    }
}

// Function to display web-safe colors
function displaySafeColors() {
    const safeColors = [0, 51, 102, 153, 204, 255];
    const table = document.getElementById('web-safe-color-table');
    table.innerHTML = '';
    safeColors.forEach(r => {
        safeColors.forEach(g => {
            safeColors.forEach(b => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>rgb(${r}, ${g}, ${b})</td>
                    <td>#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}</td>
                    <td style="background-color: rgb(${r}, ${g}, ${b});"></td>
                `;
                table.appendChild(row);
            });
        });
    });
}

// Initialize dropdowns when the page loads
window.onload = function () {
    setValues();
};
