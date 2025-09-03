const { ethers } = require('ethers');
const db = require('../config/database');
const Ticket = db.Ticket;

// ABI for the TravelBooking contract (just the event we need to listen to)
const contractABI = [
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
  }
];

// Setup blockchain event listener
const setupBlockchainListener = async () => {
  console.log('Setting up blockchain event listener...');
  try {
    // Connect to Ethereum network
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    
    // Contract address
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
      console.error('Contract address not provided in environment variables');
      return;
    }
    
    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    
    // Check if provider is connected
    try {
      await provider.getBlockNumber();
      console.log('Successfully connected to Ethereum network');
    } catch (error) {
      console.error('Failed to connect to Ethereum network:', error.message);
      console.log('Blockchain listener could not be established. The application will run with limited functionality.');
      return false;
    }
    
    // Use polling instead of filters since some public endpoints don't support filters
    console.log('Using polling for blockchain events (every 30 seconds)');
    
    // Store the last processed block to avoid duplicate processing
    let lastProcessedBlock = await provider.getBlockNumber();
    console.log(`Starting event polling from block ${lastProcessedBlock}`);
    
    // Set up polling interval (every 30 seconds)
    const pollingInterval = setInterval(async () => {
      try {
        const currentBlock = await provider.getBlockNumber();
        
        if (currentBlock > lastProcessedBlock) {
          console.log(`Checking for events from block ${lastProcessedBlock + 1} to ${currentBlock}`);
          
          // Query for events in the block range
          const events = await contract.queryFilter('TicketBooked', lastProcessedBlock + 1, currentBlock);
          
          // Process each event
          for (const event of events) {
            const [user, source, destination, distance, fare] = event.args;
            
            // Generate a unique ticket ID using the transaction hash
            const ticketId = event.transactionHash.substring(0, 10);
            // Use current timestamp since it's not in the event
            const timestamp = Math.floor(Date.now() / 1000);
            
            console.log('TicketBooked event received:', {
              ticketId,
              source,
              destination,
              distance: distance.toString(),
              fare: ethers.formatEther(fare) + ' ETH',
              user,
              timestamp: new Date(timestamp * 1000).toISOString()
            });
            
            try {
              // Save ticket to database if database is available
              if (db.sequelize && db.sequelize.authenticate) {
                await Ticket.create({
                  ticketId,
                  source,
                  destination,
                  passengerName: 'Unknown', // We don't have this in the event
                  fare: ethers.formatEther(fare) + ' ETH',
                  walletAddress: user.toLowerCase(),
                  timestamp: new Date(timestamp * 1000),
                  transactionHash: event.transactionHash
                });
                console.log('Ticket saved to database:', ticketId.toString());
              } else {
                console.log('Database not available, ticket not saved');
              }
            } catch (error) {
              console.error('Error saving ticket to database:', error);
            }
          }
          
          // Update the last processed block
          lastProcessedBlock = currentBlock;
        }
      } catch (error) {
        console.error('Error polling for events:', error);
      }
    }, 30000); // Poll every 30 seconds
    
    console.log('Blockchain event polling setup complete');
    return true;
  } catch (error) {
    console.error('Error setting up blockchain listener:', error);
    console.log('Blockchain listener could not be established. The application will run with limited functionality.');
    return false;
  }
};

module.exports = {
  setupBlockchainListener
};
