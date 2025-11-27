const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/table-attributes', (req, res) => {
  const { tableName } = req.body;
  const query = `SHOW COLUMNS FROM ${tableName}`;
  db.query(query, (err, result) => {
    if (err) throw err;
    const columnNames = result.map(col => col.Field);
    res.json(columnNames);
  });
});

app.post('/fetchWholeTable', (req, res) => {
  const { tableName } = req.body;
  const query = `SELECT * FROM ${tableName}`;
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/custom', (req, res) => {
  const { query, checkboxstatus } = req.body;

  if (checkboxstatus && !query.toLowerCase().startsWith('select')) {
    return res.status(400).send('Only SELECT queries are allowed for safety.');
  }

  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.post('/add-user', (req, res) => {
  const { first_name, last_name, contact, email, password } = req.body;
  const query = `INSERT INTO registration (first_name, last_name, contact, email, password) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [first_name, last_name, contact, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database insert failed' });
    }
    res.json({ message: 'User added successfully' });
  });
});

app.post('/user-dba-login', (req, res) => {
  const { email, password, who } = req.body;
  if (who == 'user') {
    fromTable = 'registration';
  } else {
    fromTable = 'dba';
  }

  const query = `SELECT * FROM ${fromTable} WHERE email = ? AND password = ?`;
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });
});


app.get('/ticket/date/:date', (req, res) => {
  const date = req.params.date;
  db.query('SELECT DISTINCT origin FROM flight WHERE departure_date LIKE ? ORDER BY origin ASC',[`${date}%`], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/ticket/origin/:origin/date/:date', (req, res) => {
  const origin = req.params.origin;
  const date = req.params.date;
  db.query('SELECT DISTINCT destination FROM flight WHERE origin = ? AND departure_date LIKE ? ORDER BY destination ASC',[origin, `${date}%`], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/ticket/origin/:origin/destination/:destination/date/:date', (req, res) => {
  const origin = req.params.origin;
  const destination = req.params.destination;
  const date = req.params.date;
  db.query('SELECT departure FROM flight WHERE origin = ? AND destination = ? AND departure_date LIKE ?',[origin, destination, `${date}%`], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/ticket/origin/:origin/destination/:destination/date/:date/pricetype/:pricetype', (req, res) => {
  const origin = req.params.origin;
  const destination = req.params.destination;
  const date = req.params.date;
  const pricetype = req.params.pricetype;
  db.query(`SELECT ${pricetype} FROM flight WHERE origin = ? AND destination = ? AND departure_date LIKE ?`,[origin, destination, `${date}%`], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/ticket/origin/:origin/destination/:destination/date/:date/flightid/', (req, res) => {
  const origin = req.params.origin;
  const destination = req.params.destination;
  const date = req.params.date;
  db.query(`SELECT flight_id FROM flight WHERE origin = ? AND destination = ? AND departure_date LIKE ?`,[origin, destination, `${date}%`], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/append-aircraft', (req, res) => {
  const { aircraft_id, model, manufacturer, capacity, first_class_cap, business_class_cap, premium_eco_class_cap, economy_class_cap } = req.body;
  const query = `INSERT INTO aircraft (aircraft_id, model, manufacturer, capacity, first_class_cap, business_class_cap, premium_eco_class_cap, economy_class_cap) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [aircraft_id, model, manufacturer, capacity, first_class_cap, business_class_cap, premium_eco_class_cap, economy_class_cap], (err, result) => {
    if (err) {
    	console.error(err);
    	return res.status(500).json({ message: 'Database error', error: err.sqlMessage });
    }
    res.json({ message: 'Row added successfully' });
  });
});

app.post('/append-flight', (req, res) => {
  const { flightid, flightaircraftid, flightorigin, flightdestination, flightdeparturedate, flightdeparturetime, flightfirstclassprice, flightbusinessclassprice, flightpremiumecoclassprice, flighteconomyclassprice } = req.body;
  const query = `INSERT INTO flight (flight_id , aircraft_id , origin , destination, departure_date, departure, first_class_price, business_class_price, premium_eco_class_price, economy_class_price ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [flightid, flightaircraftid, flightorigin, flightdestination, flightdeparturedate, flightdeparturetime, flightfirstclassprice, flightbusinessclassprice, flightpremiumecoclassprice, flighteconomyclassprice], (err, result) => {
    if (err) {
    	console.error(err);
    	return res.status(500).json({ message: 'Database error', error: err.sqlMessage });
    }
    res.json({ message: 'Row added successfully' });
  });
});

app.post('/append-airport', (req, res) => {
  const { airportid, airportname, airportcity, airportcountry } = req.body;
  const query = `INSERT INTO airport (airport_id , name, city, country) VALUES (?, ?, ?, ?)`;
  db.query(query, [airportid, airportname, airportcity, airportcountry], (err, result) => {
    if (err) {
    	console.error(err);
    	return res.status(500).json({ message: 'Database error', error: err.sqlMessage });
    }
    res.json({ message: 'Row added successfully' });
  });
});

app.post('/append-crew', (req, res) => {
  const { crewid, crewfirstname, crewlastname, crewrole, crewcontact } = req.body;
  const query = `INSERT INTO crew (crew_id , first_name, last_name, role, contact) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [crewid, crewfirstname, crewlastname, crewrole, crewcontact], (err, result) => {
    if (err) {
    	console.error(err);
    	return res.status(500).json({ message: 'Database error', error: err.sqlMessage });
    }
    res.json({ message: 'Row added successfully' });
  });
});

app.post('/append-pilot', (req, res) => {
  const { pilotflightid, pilotcrewid } = req.body;
  const query = `INSERT INTO pilot (flight_id  , crew_id) VALUES (?, ?)`;
  db.query(query, [pilotflightid, pilotcrewid], (err, result) => {
    if (err) {
    	console.error(err);
    	return res.status(500).json({ message: 'Database error', error: err.sqlMessage });
    }
    res.json({ message: 'Row added successfully' });
  });
});

app.post('/booking', (req, res) => {
  const { bookingid, flightid, aadhaar, firstname, lastname, email, contact, classtype, seat, price } = req.body;
  const query = `INSERT INTO booking (booking_id , flight_id, aadhaar, first_name, last_name, email, contact, class, seat, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [bookingid, flightid, aadhaar, firstname, lastname, email, contact, classtype, seat, price], (err, result) => {
    if (err) {
    	console.error(err);
    	return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.json({ message: bookingid });
  });
});

app.get('/track/firstname/:firstname/lastname/:lastname/aadhaar/:aadhaar/contact/:contact/email/:email/booking_id', (req, res) => {
  const firstname = req.params.firstname;
  const lastname = req.params.lastname;
  const aadhaar = req.params.aadhaar;
  const contact = req.params.contact;
  const email = req.params.email;
  db.query('SELECT booking_id FROM booking WHERE first_name = ? AND last_name = ? AND aadhaar LIKE ? AND contact LIKE ? AND email = ?', [firstname, lastname, `${aadhaar}%`, `%${contact}`, email], (err, result) => {
    if (err) {
    	console.error(err);
    	return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.json(result);
  });
});

app.get('/track/booking_id/:ticketid', (req, res) => {
  const bookingid = req.params.ticketid;
  db.query('SELECT first_name, last_name, class, seat, flight_id FROM booking WHERE booking_id = ?', [bookingid], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/flight/flight_id/:flightid', (req, res) => {
  const flightid = req.params.flightid;
  db.query('SELECT origin, destination, departure_date, departure, aircraft_id FROM flight WHERE flight_id = ?', [flightid], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/aircraft/aircraft_id/:aircraftid', (req, res) => {
  const aircraftid = req.params.aircraftid;
  db.query('SELECT model FROM aircraft WHERE aircraft_id = ?', [aircraftid], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));