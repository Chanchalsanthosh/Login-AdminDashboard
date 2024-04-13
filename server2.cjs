const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./env/tbiweb-65e36-firebase-adminsdk-m4y0t-df025551e2.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tbiweb-65e36.firebaseio.com'
});

// Login Route
// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Query the Admin_credentials collection in Firestore for the provided username
        const querySnapshot = await admin.firestore().collection('Admin_credentials').where('username', '==', username).get();

        // Check if any document matches the provided username
        if (querySnapshot.empty) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Assuming there's only one document matching the username
        const doc = querySnapshot.docs[0].data();

        // Compare the stored password with the provided password
        if (doc.password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // If authentication is successful, generate a JWT token
        const token = jwt.sign({ userId: querySnapshot.docs[0].id }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
