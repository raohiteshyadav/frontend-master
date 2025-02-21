import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceRequestApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch pending service requests from the server
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/service-requests/pending');
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load service requests');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApproval = async (requestId, action) => {
    try {
      const response = await axios.post('/api/service-requests/approve', { requestId, action });
      if (response.data.success) {
        setRequests(requests.filter(request => request.id !== requestId)); // Update list after approval/rejection
      }
    } catch (err) {
      setError('Error in approving/rejecting service request');
    }
  };

  if (loading) return <div>Loading service requests...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Service Request Approval</h2>
      {requests.length === 0 ? (
        <p>No pending service requests</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Requestor</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.requestor}</td>
                <td>{request.description}</td>
                <td>
                  <button onClick={() => handleApproval(request.id, 'approve')}>Approve</button>
                  <button onClick={() => handleApproval(request.id, 'reject')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServiceRequestApproval;
