// Function to fetch parts data and update the HTML
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);
function fetchAndDisplayParts545() {
  // Make an HTTP GET request to your /parts endpoint
  fetch('/parts')
    .then((response) => response.json())
    .then((data) => {
      const partsList = document.getElementById('parts-list');

      // Create an HTML table to display the parts data
      const table = document.createElement('table');
      table.classList.add('parts-table');

      // Create table headers
      const headers = ['Part Number', 'Part Name', 'Price'];
      const headerRow = document.createElement('tr');
      headers.forEach((headerText) => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
      });
      table.appendChild(headerRow);

      // Create table rows for each part
      data.forEach((part) => {
        const row = document.createElement('tr');
        for (const key in part) {
          if (part.hasOwnProperty(key) && key !== 'qoh545') {
            const cell = document.createElement('td');
            cell.textContent = part[key];
            row.appendChild(cell);
          }
        }
        table.appendChild(row);
      });

      // Append the table to the parts-list div
      partsList.appendChild(table);
    })
    .catch((error) => console.error('Error fetching data:', error));
}

// Call the function to fetch and display parts data
fetchAndDisplayParts545();
