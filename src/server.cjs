const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());


const serviceAccount = require('./env/tbiweb-65e36-firebase-adminsdk-m4y0t-df025551e2.json'); // Path to your Firebase service account key file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://tbiweb-65e36.appspot.com',
    databaseURL: 'https://tbiweb-65e36.firebaseio.com',
    
});

const storage = admin.storage();
const bucket = storage.bucket();
const firestore= admin.firestore();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
});

app.post('/uploadImage', upload.single('image'), async (req, res) => {
    try {
        // Check if file is provided

        if (!req.file) {
            return res.status(400).json({ error: 'Please select a file.' });
        }

        const uniqueFilename = uuidv4() + '-' + req.file.originalname;

        const file = bucket.file(`AnnouncementData/${uniqueFilename}`);
        const fileBuffer = req.file.buffer;

        // Upload file to Firebase Storage
        await file.save(fileBuffer, {
            contentType: req.file.mimetype,
        });

        const imageUrl = await file.getSignedUrl({ action: 'read', expires: '01-01-2500' });

        res.status(200).json({ success: true, imageUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Error uploading image. Please try again.' });
    }
});

app.get('/getImageList', async (req, res) => {
    try {
        console.log("asjdhfkjsahfkj");
        const [files] = await bucket.getFiles({ prefix: 'AnnouncementData/' });

        const imageUrls = await Promise.all(files.map(async file => {
            const [url] = await file.getSignedUrl({ action: 'read', expires: '01-01-2500' });
            return url;
        }));

        res.status(200).json({ imageList: imageUrls });
    } catch (error) {
        console.error('Error fetching image list:', error);
        res.status(500).json({ error: 'Error fetching image list. Please try again.' });
    }
});

app.get('/api/announcements', async (req, res) => {
    try {
        const collectionRef = firestore.collection('Announcements');
        const querySnapshot = await collectionRef.get();
        const newData = querySnapshot.docs.map(doc => doc.data());
        const sortedData = newData.sort((a, b) => b.id - a.id);
        res.json(sortedData);
    } catch (error) {
        console.error('Error fetching documents: ', error);
        res.status(500).json({ error: 'Error fetching documents' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running on port ${PORT}");
});
