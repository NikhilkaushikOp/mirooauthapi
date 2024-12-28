const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'https://good-sugary-bonsai.glitch.me' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// POST endpoint to handle token requests
app.post('/api/token', async (req, res) => {
    const { code } = req.body;

    try {
        const response = await fetch('https://api.miro.com/v1/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: '3458764605014400064',
                client_secret: 'Bm5io2qQdP753CPFTSmRJVHsLwrEgP4X',
                code: code,
                redirect_uri: 'https://good-sugary-bonsai.glitch.me'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error retrieving access token:', error);
        res.status
