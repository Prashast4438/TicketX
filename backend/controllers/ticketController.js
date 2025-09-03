const db = require('../config/database');
const PDFDocument = require('pdfkit');
const Ticket = db.Ticket;

// Get tickets by wallet address
const getTicketsByWallet = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    const tickets = await Ticket.findAll({
      where: {
        walletAddress: walletAddress.toLowerCase()
      }
    });
    
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

// Download ticket as PDF
const downloadTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    if (!ticketId) {
      return res.status(400).json({ error: 'Ticket ID is required' });
    }
    
    const ticket = await Ticket.findByPk(ticketId);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    // Create a PDF document
    const doc = new PDFDocument();
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${ticketId}.pdf`);
    
    // Pipe the PDF document to the response
    doc.pipe(res);
    
    // Add content to the PDF
    doc.fontSize(25).text('TicketX - Blockchain Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(15).text(`Ticket ID: ${ticket.ticketId}`);
    doc.moveDown();
    doc.fontSize(12).text(`From: ${ticket.source}`);
    doc.fontSize(12).text(`To: ${ticket.destination}`);
    doc.moveDown();
    doc.fontSize(12).text(`Passenger: ${ticket.passengerName}`);
    doc.fontSize(12).text(`Fare: ${ticket.fare}`);
    doc.moveDown();
    doc.fontSize(10).text(`Transaction: ${ticket.transactionHash}`);
    doc.fontSize(10).text(`Wallet: ${ticket.walletAddress}`);
    doc.fontSize(10).text(`Date: ${new Date(ticket.timestamp).toLocaleString()}`);
    
    // Add QR code or barcode here if needed
    
    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.error('Error generating ticket PDF:', error);
    res.status(500).json({ error: 'Failed to generate ticket PDF' });
  }
};

module.exports = {
  getTicketsByWallet,
  downloadTicket
};
