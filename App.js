import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [activePage, setActivePage] = useState('login');
  const [campaigns, setCampaigns] = useState([]);

  const showPage = (pageId) => {
    setActivePage(pageId);
  };

  const addCampaign = async (campaign) => {
    try {
      const response = await axios.post('http://localhost:5000/api/save-campaign', { campaign });
      if (response.data.success) {
        setCampaigns([...campaigns, campaign]);
      }
    } catch (error) {
      console.error('Error adding campaign:', error);
    }
  };

  const gatherEmails = async (domain) => {
    try {
      const response = await axios.post('http://localhost:5000/api/gather-emails', { domain });
      return response.data.emails;
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  };

  const verifyEmails = async (emails) => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify-emails', { emails });
      return response.data.verifiedEmails;
    } catch (error) {
      console.error('Error verifying emails:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-campaigns');
        setCampaigns(response.data.campaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="container">
      {activePage === 'login' && <Login showPage={showPage} />}
      {activePage === 'dashboard' && <Dashboard showPage={showPage} />}
      {activePage === 'new-campaign' && <NewCampaign showPage={showPage} addCampaign={addCampaign} gatherEmails={gatherEmails} verifyEmails={verifyEmails} />}
      {activePage === 'view-campaigns' && <ViewCampaigns showPage={showPage} campaigns={campaigns} />}
    </div>
  );
};

const Login = ({ showPage }) => (
  <div id="login-page" className="page active">
    <h2>Login</h2>
    <form onSubmit={(e) => { e.preventDefault(); showPage('dashboard'); }}>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
);

const Dashboard = ({ showPage }) => (
  <div id="dashboard" className="page active">
    <h2>Dashboard</h2>
    <nav>
      <button className="nav-button" onClick={() => showPage('new-campaign')}>New Campaign</button>
      <button className="nav-button" onClick={() => showPage('view-campaigns')}>View Campaigns</button>
    </nav>
  </div>
);

const NewCampaign = ({ showPage, addCampaign, gatherEmails, verifyEmails }) => {
  const [campaignName, setCampaignName] = useState('');
  const [targetDomain, setTargetDomain] = useState('');
  const campaignNameRef = useRef(null);
  const targetDomainRef = useRef(null);

  const createCampaign = async () => {
    const currentDate = new Date().toLocaleDateString('en-US');

    let emails = await gatherEmails(targetDomain);
    emails = await verifyEmails(emails);

    const newCampaign = {
      name: campaignName,
      domain: targetDomain,
      date: currentDate,
      emails: emails
    };

    await addCampaign(newCampaign);

    setCampaignName('');
    setTargetDomain('');
    if (campaignNameRef.current) campaignNameRef.current.value = '';
    if (targetDomainRef.current) targetDomainRef.current.value = '';
  };

  return (
    <div id="new-campaign" className="section active">
      <h3>Create New Campaign</h3>
      <form onSubmit={(e) => { e.preventDefault(); createCampaign(); showPage('dashboard'); }}>
        <div className="form-group">
          <label htmlFor="campaign-name">Campaign Name:</label>
          <input
            type="text"
            id="campaign-name"
            required
            ref={campaignNameRef}
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="target-domain">Target Domain:</label>
          <input
            type="text"
            id="target-domain"
            required
            ref={targetDomainRef}
            value={targetDomain}
            onChange={(e) => setTargetDomain(e.target.value)}
          />
        </div>
        <button type="submit">Create Campaign</button>
      </form>
      <button className="back-button" onClick={() => showPage('dashboard')}>Back to Dashboard</button>
    </div>
  );
};

const ViewCampaigns = ({ showPage, campaigns }) => {
  const sortedCampaigns = campaigns.sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateB - dateA;
  });

  const uniqueDomains = [...new Set(campaigns.map(campaign => campaign.domain))];

  return (
    <div id="view-campaigns" className="section active">
      <h3>View Campaigns</h3>
      <div className="form-group">
        <label htmlFor="select-domain">Select Domain:</label>
        <select id="select-domain">
          <option value="">All Domains</option>
          {uniqueDomains.map((domain, index) => (
            <option key={index} value={domain}>{domain}</option>
          ))}
        </select>
      </div>
      <ul id="campaign-list">
        {sortedCampaigns.map((campaign, index) => (
          <li key={index}>
            {campaign.name} - {campaign.date} - {campaign.domain}
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={() => showPage('dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default App;
