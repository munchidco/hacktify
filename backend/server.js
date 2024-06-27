const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const campaignsFile = path.join(__dirname, 'campaigns.json');
const usersFile = path.join(__dirname, 'users.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key_here';

// Helper function to read JSON data from a file
const readJSONFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Helper function to write JSON data to a file
const writeJSONFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const users = await readJSONFile(usersFile);
  
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, email, password: hashedPassword };
  users.push(newUser);
  
  await writeJSONFile(usersFile, users);
  res.json({ message: 'User registered successfully' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await readJSONFile(usersFile);
  const user = users.find(user => user.email === email);
  
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/api/save-campaign', authenticateToken, async (req, res) => {
  const { campaign } = req.body;
  const campaigns = await readJSONFile(campaignsFile);
  
  const newCampaign = { ...campaign, userId: req.user.id };
  campaigns.push(newCampaign);
  
  await writeJSONFile(campaignsFile, campaigns);
  res.json({ success: true });
});

app.get('/api/get-campaigns', authenticateToken, async (req, res) => {
  const campaigns = await readJSONFile(campaignsFile);
  const userCampaigns = campaigns.filter(campaign => campaign.userId === req.user.id);
  
  res.json({ campaigns: userCampaigns });
});

app.post('/api/gather-emails', authenticateToken, (req, res) => {
  const { domain } = req.body;
  const emails = [
    `info@${domain}`,
    `support@${domain}`,
    `contact@${domain}`,
    `sales@${domain}`
  ];
  res.json({ emails });
});

app.post('/api/verify-emails', authenticateToken, (req, res) => {
  const { emails } = req.body;
  const verifiedEmails = emails.filter(email => !email.startsWith('support@'));
  res.json({ verifiedEmails });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
