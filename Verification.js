const express = require("express");
const connectDB = require("./db"); // Your MongoDB connection function
const sendVerificationEmail = require("./email"); // Function to send verification email

const app = express();

// Other middleware and route handlers...

// Route for user signup
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Save user data to the database
    const newUser = await saveUserDataToDB(
      firstName,
      lastName,
      email,
      password
    );

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: "User signed up successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Other routes...

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
