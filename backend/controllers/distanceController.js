const axios = require('axios');

// Using Google Maps Distance Matrix API for distance calculation
// You'll need to get an API key from Google Cloud Platform
const calculateDistance = async (req, res) => {
  try {
    const { source, destination } = req.query;
    
    if (!source || !destination) {
      return res.status(400).json({ error: 'Source and destination are required' });
    }

    // For demo purposes, we'll use a mock response
    // In production, you would use the actual API call:
    /*
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(source)}&destinations=${encodeURIComponent(destination)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    
    const distance = response.data.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
    */
    
    // Mock distance calculation (for demo)
    const mockDistance = calculateMockDistance(source, destination);
    
    res.json({
      source,
      destination,
      distance: mockDistance,
      unit: 'km'
    });
  } catch (error) {
    console.error('Error calculating distance:', error);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
};

// Mock function to simulate distance calculation
const calculateMockDistance = (source, destination) => {
  // This is just a simple hash function to generate consistent distances
  // In production, use a real distance API
  const combinedString = `${source.toLowerCase()}-${destination.toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < combinedString.length; i++) {
    hash = combinedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate a distance between 5 and 100 km
  return Math.abs(hash % 96) + 5;
};

module.exports = {
  calculateDistance
};
