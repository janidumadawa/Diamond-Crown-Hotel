// backend/src/controllers/contact.js
const Contact = require('../models/Contact');

// Submit contact form (Public)
exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // If user is authenticated, get their user ID
    const userId = req.user ? req.user.id : null;

    const contact = await Contact.create({
      name,
      email,
      message,
      userId
    });
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Get all contact messages (Admin only)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

// Mark message as read (Admin only)
exports.markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    ).populate('userId', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating message status',
      error: error.message
    });
  }
};


exports.getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const messages = await Contact.find({ userId })
      .select('message status createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user messages',
      error: error.message
    });
  }
};
