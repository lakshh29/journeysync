const express = require('express');
const app = express();

// Set up EJS as the template engine
app.set('view engine', 'ejs');

// Define a route for the payment page
app.get('/payment', (req, res) => {
  // Example passenger name data
  const passengerName = "User (20,F)";

  // Render the payment.ejs template and pass the passengerName variable
  res.render('payment', { passengerName });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


