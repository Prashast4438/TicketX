const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    ticketId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passengerName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Unknown'
    },
    fare: {
      type: DataTypes.STRING,
      allowNull: false
    },
    walletAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    transactionHash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'tickets',
    timestamps: true
  });

  return Ticket;
};
