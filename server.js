const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

// ...existing code...

app.use(bodyParser.json());

app.post('/api/verify-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is required');
  }

  try {
    // Assuming you have a function to update the user status in the database
    await updateUserStatus(email, 'activated');
    res.status(200).send('Email verified successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

async function updateUserStatus(email, status) {
  // Implement the logic to update the user status in the database
  // Example:
  // await User.updateOne({ email }, { status });
}

// ...existing code...

app.listen(port, () => console.log(`Listening on port ${port}`));
