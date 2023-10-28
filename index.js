const express = require('express');
const mysql = require('mysql2'); // Use the 'mysql2' library

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // Replace with your MySQL username
  password: '000998310', // Replace with your MySQL password
  database: 'Assignment2',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Define your REST API endpoints and routes here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Define an endpoint to list parts
app.get('/parts', (req, res) => {
    // Query the database to get a list of parts
    db.query('SELECT * FROM Parts545', (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
  app.get('/parts/:partNumber', (req, res) => {
    const partNumber = req.params.partNumber;
  
    // Query the database to get information about the specified part
    db.query('SELECT * FROM parts545 WHERE partNo545 = ?', [partNumber], (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Part not found' });
      } else {
        res.json(results[0]);
      }
    });
  });
 

  app.get('/pos', (req, res) => {
    // Query the database to get the list of purchase orders from the POs545 table
    db.query('SELECT * FROM POs545', (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
  // Add an endpoint to fetch lines by PO number
app.get('/lines/:poNumber', (req, res) => {
  const poNumber = req.params.poNumber;

  // Query the database to get lines for the specified PO number
  db.query('SELECT * FROM Lines545 WHERE poNo545 = ?', [poNumber], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'No lines found for the specified PO number' });
    } else {
      res.json(results);
    }
  });
});
app.get('/get-parts', (req, res) => {
  // Query the database to get a list of available parts
  db.query('SELECT partNo545, partName545, currentPrice545, qoh545 FROM Parts545', (err, results) => {
    if (err) {
      console.error('Error querying the database for parts:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});
app.get('/add-to-cart', (req, res) => {
  const selectedPartNo = req.query.partNo;

  // Query the database to get details of the selected part
  db.query('SELECT partName545, currentPrice545, qoh545 FROM Parts545 WHERE partNo545 = ?', [selectedPartNo], (err, results) => {
    if (err) {
      console.error('Error querying the database for the selected part:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(400).json({ error: 'Invalid part selection' });
    } else {
      const part = results[0];
      if (part.qoh545 <= 0) {
        res.status(400).json({ error: 'Part out of stock' });
      } else {
        // Calculate the price (assuming quantity of 1)
        const price = parseFloat(part.currentPrice545);
        const cartItem = { partName545: part.partName545, price };

        // You can add additional logic here, e.g., reducing stock quantity in the database

        res.json(cartItem);
      }
    }
  });
});
// Define an endpoint to fetch the next PO number
app.get('/next-po-number', (req, res) => {
  // Query the database to get the highest existing PO number
  db.query('SELECT MAX(poNo545) AS maxPoNumber FROM POs545', (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Extract the highest PO number from the results
      const maxPoNumber = results[0].maxPoNumber;
      // Calculate the next PO number by incrementing the highest one
      const nextPoNumber = maxPoNumber + 1;
      res.json({ nextPoNumber });
    }
  });
});


 // Define an endpoint to insert data into Client545
app.post('/insert-client-data', (req, res) => {
  const { clientId545, clientName545, clientCity545, moneyOwed545 } = req.body;

  // Create an SQL INSERT statement
  const sql = 'INSERT INTO Clients545 (clientId545, clientName545, clientCity545, moneyOwed545) VALUES (?, ?, ?, ?)';

  // Execute the SQL query
  db.query(sql, [clientId545, clientName545, clientCity545, moneyOwed545], (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ error: 'Error inserting data' });
      } else {
          console.log('Data inserted into Clients545;');
          res.json({ message: 'Data inserted successfully' });
      }
  });
});


 // Define an endpoint to insert data into Client545
app.post('/insert-PO-data', (req, res) => {
  const { poNo545, clientCompID545, dateOfPO545, status545 } = req.body;

  // Create an SQL INSERT statement
  const sql = 'INSERT INTO POs545 (poNo545, clientCompID545, dateOfPO545, status545) VALUES (?, ?, ?, ?)';

  // Execute the SQL query
  db.query(sql, [poNo545, clientCompID545, dateOfPO545, status545], (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ error: 'Error inserting data' });
      } else {
          console.log('Data inserted into Pos545;');
          res.json({ message: 'Data inserted successfully' });
      }
  });
});

 //Define an endpoint to insert data into Lines545
app.post('/insert-line-data', (req, res) => {
  const { poNo545, lineNo545, partNo545, qty545, priceOrdered545 } = req.body;

  // Create an SQL INSERT statement
  const sql = `INSERT INTO Lines545 (poNo545, lineNo545, partNo545, qty545, priceOrdered545) VALUES (?, ?, ?, ?, ?)`;

  // Execute the SQL query
  db.query(sql, [poNo545, lineNo545, partNo545, qty545, priceOrdered545], (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ error: 'Error inserting data' });
      } else {
          console.log('Data inserted into Lines545');
          res.json({ message: 'Data inserted successfully' });
      }
  });
}); 

// Serve static files from the "public" folder
app.use(express.static('public'));

// Your other routes and code here