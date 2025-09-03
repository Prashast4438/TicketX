// ignition/modules/TravelBookingModule.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TravelBookingModule", (m) => {
  // Deploy the TravelBooking contract with rate per km (0.0000001 ETH = 100000000000 wei)
  const travelBooking = m.contract("TravelBooking", [100000000000]);

  return { travelBooking };
});
