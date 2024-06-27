const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const { gatherEmails, verifyEmails } = require('./emailUtils');
const { saveCampaign, getCampaigns } = require('./db');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());

app.post('/api/gather-emails', async (req, res) => {
  try {
    const { domain } = req.body;
    const emails = await gatherEmails(domain);
    res.json({ emails });
  } catch (error) {
    console.error('Error gathering emails:', error);
    res.status(500).json({ error: 'Failed to gather emails' });
  }
});

app.post('/api/verify-emails', async (req, res) => {
  try {
    const { emails } = req.body;
    const verifiedEmails = await verifyEmails(emails);
    res.json({ verifiedEmails });
  } catch (error) {
    console.error('Error verifying emails:', error);
    res.status(500).json({ error: 'Failed to verify emails' });
  }
});

app.post('/api/save-campaign', async (req, res) => {
  try {
    const { campaign } = req.body;
    await saveCampaign(campaign);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving campaign:', error);
    res.status(500).json({ error: 'Failed to save campaign' });
  }
});

app.get('/api/get-campaigns', async (req, res) => {
  try {
    const campaigns = await getCampaigns();
    res.json({ campaigns });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    res.status(500).json({ error: 'Failed to get campaigns' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
