// ViewClient.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../http/api";
import "./ViewClient.css"; // Create this file

export default function ViewClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/client/${id}`);
        
        if (!response) {
          throw new Error("Client not found");
        }
        
        setClient(response?.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClient();
  }, [id]);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!client) return <div className="not-found">Client not found</div>;

  return (
    <div className="view-client-container">
      <div className="header-section">
        <h1>{client.fullName}'s Profile</h1>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
      </div>

      <div className="client-details-grid">
        <div className="profile-section">
          {client.photoUrl && (
            <img 
              src={client.photoUrl} 
              alt="Client" 
              className="profile-image"
            />
          )}
          <div className="status-badges">
            <span className={`status ${client.isActive ? 'active' : 'inactive'}`}>
              {client.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className={`verification ${client.isVerified ? 'verified' : 'unverified'}`}>
              {client.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>

        <div className="details-section">
          <div className="detail-group">
            <h3>Personal Information</h3>
            <Detail label="Full Name" value={client.fullName} />
            <Detail label="Email" value={client.email} />
            <Detail label="Phone" value={client.phoneNumber} />
            <Detail label="Gender" value={client.gender} />
            <Detail label="Date of Birth" value={new Date(client.birthDate).toLocaleDateString()} />
            <Detail label="Anniversary" value={new Date(client.anniversaryDate).toLocaleDateString()} />
          </div>

          <div className="detail-group">
            <h3>Address Information</h3>
            <Detail label="Address" value={client.address.replace(/\r\n/g, ', ')} />
            <Detail label="City" value={client.city} />
            <Detail label="State" value={client.state} />
            <Detail label="Pincode" value={client.pincode} />
          </div>

          <div className="detail-group">
            <h3>Account Details</h3>
            <Detail label="Account Created" value={new Date(client.createdAt).toLocaleString()} />
            <Detail label="Last Updated" value={new Date(client.updatedAt).toLocaleString()} />
            <Detail label="User Role" value={client.role.replace('_', ' ')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <strong>{label}:</strong>
      <span>{value || 'N/A'}</span>
    </div>
  );
}