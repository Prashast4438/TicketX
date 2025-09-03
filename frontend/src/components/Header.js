import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext';

const Header = () => {
  const { account, connectWallet, disconnectWallet, isConnecting, isMetaMaskInstalled } = useContext(WalletContext);

  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="header">
      <Link to="/" className="logo">TicketX</Link>
      
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        {account && <Link to="/my-tickets" className="nav-link">My Tickets</Link>}
      </nav>
      
      <div>
        {!isMetaMaskInstalled ? (
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="wallet-button"
          >
            Install MetaMask
          </a>
        ) : account ? (
          <div className="wallet-status">
            <span className="wallet-address">{formatAddress(account)}</span>
            <button 
              className="wallet-button wallet-connected" 
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            className="wallet-button" 
            onClick={connectWallet}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
