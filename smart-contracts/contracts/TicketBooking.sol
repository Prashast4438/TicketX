// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TravelBooking {
    address public owner;
    uint256 public ratePerKm; // in wei per km

    event TicketBooked(address indexed user, string source, string destination, uint256 distance, uint256 fare);

    constructor(uint256 _ratePerKm) {
        owner = msg.sender;
        ratePerKm = _ratePerKm;
    }

    // Function to update rate per km (only owner)
    function updateRate(uint256 newRate) external {
        require(msg.sender == owner, "Only owner can update rate");
        ratePerKm = newRate;
    }

    // Main booking function
    function bookTicket(string memory source, string memory destination, uint256 distanceInKm) external payable {
        require(distanceInKm > 0, "Distance must be > 0");

        uint256 fare = distanceInKm * ratePerKm;
        require(msg.value >= fare, "Insufficient ETH sent");

        // Refund excess if user sent more than required
        if (msg.value > fare) {
            payable(msg.sender).transfer(msg.value - fare);
        }

        // Directly transfer fare to owner
        payable(owner).transfer(fare);

        emit TicketBooked(msg.sender, source, destination, distanceInKm, fare);
    }
}
