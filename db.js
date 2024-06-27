const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/mydb';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function saveCampaign(campaign) {
  try {
    await client.connect();
    const database = client.db('campaignDB');
    const campaigns = database.collection('campaigns');
    await campaigns.insertOne(campaign);
  } catch (error) {
    console.error('Error saving campaign to database:', error);
    throw error; // Re-throw error after logging
  } finally {
    await client.close();
  }
}

async function getCampaigns() {
  try {
    await client.connect();
    const database = client.db('campaignDB');
    const campaigns = database.collection('campaigns');
    return await campaigns.find().toArray();
  } catch (error) {
    console.error('Error retrieving campaigns from database:', error);
    throw error; // Re-throw error after logging
  } finally {
    await client.close();
  }
}

module.exports = { saveCampaign, getCampaigns };
