const axios = require('axios');
const querystring = require('querystring');
const dotenv = require('dotenv');

dotenv.config();

const getSpotifyAccessToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({ grant_type: 'client_credentials' }), 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        }
      });
    return response.data.access_token;
  } catch (err) {
    console.error('Error getting Spotify access token:', err.message);
  }
};

module.exports = getSpotifyAccessToken;
