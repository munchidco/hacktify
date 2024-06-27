import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CampaignManagement() {
  const [campaigns, setCampaigns] = useState([]);
  const [targetDomain, setTargetDomain] = useState('');

  useEffect(() => {
    async function fetchCampaigns() {
      const response = await axios.get('/api/campaigns');
      setCampaigns(response.data);
    }
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async () => {
    try {
      const response = await axios.post('/api/campaigns', { domain: targetDomain });
      setCampaigns([...campaigns, response.data]);
    } catch (error) {
      console.error('Create campaign error:', error);
    }
  };

  return (
    <div>
      <h2>Campaigns</h2>
      <div>
        <input
          type="text"
          value={targetDomain}
          onChange={(e) => setTargetDomain(e.target.value)}
          placeholder="Enter target domain"
        />
        <button onClick={handleCreateCampaign}>New Campaign</button>
      </div>
      <div>
        <h3>Existing Campaigns</h3>
        <ul>
          {campaigns.map(campaign => (
            <li key={campaign.id}>{campaign.name} - {campaign.date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CampaignManagement;