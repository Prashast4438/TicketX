import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from '../context/WalletContext';
import axios from 'axios';
import './Home.css';

// Add styles for confirmation dialog
const confirmationStyles = {
  dialog: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  content: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  confirmBtn: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

// TravelBooking Contract ABI - directly from the contract artifact
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_ratePerKm",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "source",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "destination",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "distance",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fare",
        "type": "uint256"
      }
    ],
    "name": "TicketBooked",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "source",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "destination",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "distanceInKm",
        "type": "uint256"
      }
    ],
    "name": "bookTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ratePerKm",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newRate",
        "type": "uint256"
      }
    ],
    "name": "updateRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const Home = () => {
  const { account, signer } = useContext(WalletContext);
  
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [distance, setDistance] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [contractAddress] = useState(process.env.REACT_APP_CONTRACT_ADDRESS || '');

  // Reset error and success messages when inputs change
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [source, destination, passengerName]);

  // Calculate distance
  const calculateDistance = async (e) => {
    e.preventDefault();
    
    if (!source || !destination) {
      setError('Please enter both source and destination');
      return;
    }
    
    try {
      setIsCalculating(true);
      setError(null);
      
      // Call backend API to calculate distance
      const response = await axios.get(`${process.env.REACT_APP_API_URL}`{
        params: { source, destination }
      });
      
      setDistance(response.data.distance);
      
      setIsCalculating(false);
    } catch (error) {
      console.error('Error calculating distance:', error);
      setError('Failed to calculate distance. Please try again.');
      setIsCalculating(false);
    }
  };

  // Calculate fare using smart contract
  // Function to initiate booking and show confirmation with fare
  const initiateBooking = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!source || !destination || !distance) {
      setError('Please calculate distance first');
      return;
    }
    
    
    try {
      if (!contractAddress) {
        throw new Error('Contract address is not defined in environment variables');
      }
      console.log('Calculating fare with contract address:', contractAddress);
      
      if (!signer) {
        throw new Error('No signer available. Please connect your wallet.');
      }
      console.log('Signer available:', !!signer);
      
      // Create contract instance with signer directly
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log('Contract instance created');
      
      // Get rate per km from contract
      const distanceInKm = Math.round(distance);
      try {
        // Use rate from environment variable
        const ratePerKmWei = process.env.REACT_APP_RATE_PER_KM_WEI ;
        const ratePerKm = ethers.getBigInt(ratePerKmWei);
        console.log('Using rate from environment:', ratePerKm.toString());
        
        // Calculate fare (distance * rate) directly in wei to match contract calculation
        const fareWei = ratePerKm * ethers.getBigInt(distanceInKm);
        console.log('Calculated fare in Wei:', fareWei.toString());
        const fareEth = ethers.formatEther(fareWei); // Convert to ETH for display
        console.log('Calculated fare in ETH:', fareEth);
        
        // Set estimated fare and show confirmation dialog
        setEstimatedFare(fareEth);
        setShowConfirmation(true);
      } catch (contractCallError) {
        console.error('Error calling ratePerKm():', contractCallError);
        throw new Error(`Failed to get rate from contract: ${contractCallError.message}`);
      }
    } catch (error) {
      console.error('Error calculating fare:', error);
      setError(`Failed to calculate fare: ${error.message}`);
    }
  };
  
  const bookTicket = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!source || !destination || !distance || !estimatedFare) {
      setError('Please calculate distance first');
      return;
    }
    
    // Hide confirmation dialog
    setShowConfirmation(false);
    
    try {
      setIsBooking(true);
      setError(null);
      
      // Create contract instance using the signer
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      // Convert the estimated fare (which is in ETH) back to wei for the transaction
      const fareWei = ethers.parseEther(estimatedFare);
      console.log('Booking ticket with parameters:', {
        source,
        destination,
        distance: Math.round(distance),
        fareWei: fareWei.toString()
      });
      
      // Get wallet balance for debugging
      try {
        const balance = await signer.provider.getBalance(account);
        console.log('Current wallet balance:', ethers.formatEther(balance), 'ETH');
        console.log('Required fare:', estimatedFare, 'ETH');
        console.log('Wallet has sufficient funds for fare:', balance > fareWei);
      } catch (balanceError) {
        console.error('Error checking balance:', balanceError);
      }
      
      // Book ticket - ensure parameters match the contract function signature
      // function bookTicket(string memory source, string memory destination, uint256 distanceInKm) external payable
      try {
        // Estimate gas first for debugging
        try {
          const gasEstimate = await contract.bookTicket.estimateGas(
            source, 
            destination, 
            Math.round(distance), 
            { value: fareWei }
          );
          console.log('Gas estimate:', gasEstimate.toString());
          
          // Calculate total cost (fare + gas)
          const gasPrice = await signer.provider.getFeeData();
          console.log('Gas price:', gasPrice);
          const gasCost = gasEstimate * gasPrice.gasPrice;
          console.log('Estimated gas cost:', ethers.formatEther(gasCost), 'ETH');
          console.log('Total cost (fare + gas):', ethers.formatEther(fareWei + gasCost), 'ETH');
        } catch (gasError) {
          console.error('Gas estimation failed:', gasError);
          // Continue with transaction anyway
        }
        
        // Try with explicit gas limit and price
        const tx = await contract.bookTicket(source, destination, Math.round(distance), {
          value: fareWei,
          gasLimit: 300000 // Set a reasonable gas limit
        });
        
        console.log(`Booking in progress. Transaction hash: ${tx.hash}`);
        setSuccess(`Booking in progress. Transaction hash: ${tx.hash}`);
        
        // Wait for transaction to be mined
        await tx.wait();
        
        console.log(`Ticket booked successfully! Transaction hash: ${tx.hash}`);
        setSuccess('Ticket booked successfully! Check My Tickets page to view your ticket.');
        
        // Reset form on success
        setSource('');
        setDestination('');
        setDistance(null);
        setEstimatedFare(null);
        
        // Refresh page to show updated tickets
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (txError) {
        console.error('Transaction failed:', txError);
        
        // Check for specific error types and set user-friendly error messages
        if (txError.code === 'INSUFFICIENT_FUNDS' || 
            txError.message.includes('insufficient funds') ||
            (txError.error && txError.error.message && txError.error.message.includes('insufficient funds'))) {
          setError('Insufficient funds in your wallet. Please add ETH to your account and try again.');
        } else if (txError.message.includes('user rejected') || txError.code === 'ACTION_REJECTED') {
          setError('Transaction was rejected. Please try again when you are ready to confirm.');
        } else {
          setError(`Transaction failed: ${txError.message}`);
        }
        
        // Don't reset form on error so user can try again
      }
      
      // Form reset and page reload are now handled in the try/catch block
    } catch (error) {
      console.error('Error booking ticket:', error);
      setError(`Failed to book ticket: ${error.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div>
      <h1>Book Your Ticket</h1>
      
      {!account && (
        <div className="alert alert-danger">
          Please connect your wallet to book tickets
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}
      
      <div className="booking-form">
        <h2 className="form-title">Trip Details</h2>
        
        <form onSubmit={calculateDistance}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">From</label>
              <input
                type="text"
                className="form-control"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter source station"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">To</label>
              <input
                type="text"
                className="form-control"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination station"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Passenger Name</label>
            <input
              type="text"
              className="form-control"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              placeholder="Enter passenger name"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn"
            disabled={isCalculating || !source || !destination}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Distance'}
          </button>
        </form>
      </div>
      
      {distance !== null && (
        <div className="result-card">
          <h2 className="result-title">Trip Summary</h2>
          
          <div className="result-item">
            <span className="result-label">Distance:</span>
            <span>{distance} km</span>
          </div>
          
          {/* Fare will be shown in confirmation dialog */}
          
          <div className="form-actions">
            <button 
              className="btn btn-primary" 
              onClick={calculateDistance} 
              disabled={!source || !destination || isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Calculate Distance'}
            </button>
            
            {distance && (
              <button 
                className="btn btn-success" 
                onClick={initiateBooking} 
                disabled={!account || isBooking}
              >
                {isBooking ? 'Processing...' : 'Book Ticket'}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div style={confirmationStyles.dialog}>
          <div style={confirmationStyles.content}>
            <h3>Confirm Booking</h3>
            <p><strong>From:</strong> {source}</p>
            <p><strong>To:</strong> {destination}</p>
            <p><strong>Distance:</strong> {Math.round(distance)} km</p>
            <p><strong>Fare:</strong> {Number(estimatedFare).toFixed(6)} ETH</p>
            <div style={confirmationStyles.actions}>
              <button style={confirmationStyles.cancelBtn} onClick={() => setShowConfirmation(false)}>Cancel</button>
              <button style={confirmationStyles.confirmBtn} onClick={bookTicket}>Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
