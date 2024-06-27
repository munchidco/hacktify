import React, { useState } from 'react';

const CampaignDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const showPage = (page) => {
    setActivePage(page);
  };

  return (
    <div style={styles.container}>
      {activePage === 'dashboard' && (
        <div style={styles.page}>
          <h2>Dashboard</h2>
          <nav>
            <button style={styles.button} onClick={() => showPage('new-campaign')}>New Campaign</button>
            <button style={styles.button} onClick={() => showPage('view-campaigns')}>View Campaigns</button>
          </nav>
        </div>
      )}
      {activePage === 'new-campaign' && (
        <div style={styles.page}>
          <h2>New Campaign</h2>
          {/* New Campaign content */}
        </div>
      )}
      {activePage === 'view-campaigns' && (
        <div style={styles.page}>
          <h2>View Campaigns</h2>
          {/* View Campaigns content */}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  page: {
    marginBottom: '20px',
  },
  button: {
    marginRight: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default CampaignDashboard;
