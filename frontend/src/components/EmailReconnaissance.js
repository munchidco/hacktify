import React, { useState } from 'react';
import axios from 'axios';

function EmailReconnaissance() {
  const [targetDomain, setTargetDomain] = useState('');
  const [emails, setEmails] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  const handleGatherEmails = async () => {
    try {
      const response = await axios.post('/api/emails', { domain: targetDomain });
      setEmails(response.data);
    } catch (error) {
      console.error('Gather emails error:', error);
    }
  };

  const handleVerifyEmails = async () => {
    try {
      const response = await axios.post('/api/emails/verify', { emails });
      setEmails(response.data);
    } catch (error) {
      console.error('Verify emails error:', error);
    }
  };

  const handleCsvUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await axios.post('/api/emails/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEmails(response.data);
    } catch (error) {
      console.error('CSV upload error:', error);
    }
  };

  return (
    <div>
      <h2>Email Reconnaissance</h2>
      <div>
        <input
          type="text"
          value={targetDomain}
          onChange={(e) => setTargetDomain(e.target.value)}
          placeholder="Enter target domain"
        />
        <button onClick={handleGatherEmails}>Gather Emails</button>
      </div>
      <div>
        <h3>Gathered Emails</h3>
        <ul>
          {emails.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleVerifyEmails}>Verify Emails</button>
      </div>
      <div>
        <form onSubmit={handleCsvUpload}>
          <input type="file" onChange={(e) => setCsvFile(e.target.files[0])} />
          <button type="submit">Upload CSV</button>
        </form>
      </div>
    </div>
  );
}

export default email;
