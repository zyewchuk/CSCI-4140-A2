const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// Connection to the database
const db = mysql.createConnection({
  host: "34.152.32.209",
  user: "root",
  password: "Katelyn7",
  database: 'Assignment2',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Endpoint to Fetch and displays the list of available parts from the Parts545 table
app.get('/parts', (req, res) => {
  db.query('SELECT * FROM Parts545', (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});
// endpoint to have the user enter in a partNo545 then display only the info for the part number the user enters 
app.get('/parts/:partNumber', (req, res) => {
  const partNumber = req.params.partNumber;
  
  db.query('SELECT * FROM Parts545 WHERE partNo545 = ?', [partNumber], (err, results) => {
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
// endpoint to display the information that is displayed in the POs545 table
app.get('/pos', (req, res) => {
  db.query('SELECT * FROM POs545', (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});
// Display line information given a PoNo545
app.get('/lines/:poNumber', (req, res) => {
  const poNumber = req.params.poNumber;

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
//This endpoint is used in the SubmitPO.html to display the availible parts for the dropdown menu 
app.get('/get-parts', (req, res) => {
  db.query('SELECT partNo545, partName545, currentPrice545, qoh545 FROM Parts545', (err, results) => {
    if (err) {
      console.error('Error querying the database for parts:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});
// This endpoint is used to handle the process of adding a part to the cart based on what the user clicks
app.get('/add-to-cart', (req, res) => {
  const selectedPartNo = req.query.partNo;

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
        const price = parseFloat(part.currentPrice545);
        const cartItem = { partName545: part.partName545, price };
        res.json(cartItem);
      }
    }
  });
});
// endpoint to fetch how many purchase orders that there have been, increment by one to display the current Po number which is being made
app.get('/next-po-number', (req, res) => {
  db.query('SELECT MAX(poNo545) AS maxPoNumber FROM POs545', (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const maxPoNumber = results[0].maxPoNumber;
      const nextPoNumber = maxPoNumber + 1;
      res.json({ nextPoNumber });
    }
  });
});
// this endpont is made to insert data into the Clients545 table with all parameters.
app.post('/insert-client-data', (req, res) => {
  const { clientId545, clientName545, clientCity545, moneyOwed545 } = req.body;

  const sql = 'INSERT INTO Clients545 (clientId545, clientName545, clientCity545, moneyOwed545) VALUES (?, ?, ?, ?)';

  db.query(sql, [clientId545, clientName545, clientCity545, moneyOwed545], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log('Data inserted into Clients545');
      res.json({ message: 'Data inserted successfully' });
    }
  });
});
// this endpont is made to insert data into the POs545 table with all parameters.
app.post('/insert-PO-data', (req, res) => {
  const { poNo545, clientCompID545, dateOfPO545, status545 } = req.body;

  const sql = 'INSERT INTO POs545 (poNo545, clientCompID545, dateOfPO545, status545) VALUES (?, ?, ?, ?)';

  db.query(sql, [poNo545, clientCompID545, dateOfPO545, status545], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log('Data inserted into POs545');
      res.json({ message: 'Data inserted successfully' });
    }
  });
});
// this endpont is made to insert data into the Lines545table with all parameters.
app.post('/insert-line-data', (req, res) => {
  const { poNo545, lineNo545, partNo545, qty545, priceOrdered545 } = req.body;

  const sql = 'INSERT INTO Lines545 (poNo545, lineNo545, partNo545, qty545, priceOrdered545) VALUES (?, ?, ?, ?, ?)';

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

app.use(express.static('public'));
