import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';
import axios from 'axios';

const MyTickets = () => {
  const { account } = useContext(WalletContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!account) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/tickets/${account}`
        );

        setTickets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to fetch tickets. Please try again later.');
        setLoading(false);
      }
    };

    fetchTickets();
  }, [account]);

  const downloadTicket = (ticketId) => {
    window.open(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/tickets/${ticketId}/download`,
      '_blank'
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!account) {
    return (
      <div>
        <h1>My Tickets</h1>
        <div className="alert alert-danger">
          Please connect your wallet to view your tickets
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>My Tickets</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="alert alert-info">
          You don't have any tickets yet. Go to the home page to book a ticket.
        </div>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div key={ticket.ticketId} className="ticket-card">
              <div className="ticket-header">
                <h3 className="ticket-route">
                  {ticket.source} → {ticket.destination}
                </h3>
                <span className="ticket-id">#{ticket.ticketId}</span>
              </div>

              <div className="ticket-details">
                <div className="ticket-detail">
                  <span>Passenger:</span>
                  <span>{ticket.passengerName}</span>
                </div>
                <div className="ticket-detail">
                  <span>Fare:</span>
                  <span>{ticket.fare}</span>
                </div>
                <div className="ticket-detail">
                  <span>Date:</span>
                  <span>{formatDate(ticket.timestamp)}</span>
                </div>
              </div>

              <div className="ticket-actions">
                <button
                  className="btn"
                  onClick={() => downloadTicket(ticket.ticketId)}
                >
                  Download Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
