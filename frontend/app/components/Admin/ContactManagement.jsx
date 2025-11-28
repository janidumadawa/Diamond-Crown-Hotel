"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { michroma } from "../../../lib/fonts";
import { adminAPI } from "../../../lib/adminAPI";

const ContactManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getContacts();
            setContacts(response.data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            alert("Error fetching contact messages");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await adminAPI.markContactAsRead(id);
            // Update the local state instead of refetching
            setContacts(prevContacts => 
                prevContacts.map(contact => 
                    contact._id === id 
                        ? { ...contact, status: 'read' }
                        : contact
                )
            );
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleContactClick = async (contact) => {
        // First set the selected contact to show the modal
        setSelectedContact(contact);
        
        // Then mark as read if it's new (without refreshing the list)
        if (contact.status === 'new') {
            await markAsRead(contact._id);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`${michroma.className} text-3xl font-bold text-[#2d2a32] mb-4`}>
                    Contact Messages
                </h1>
                <div className="w-20 h-1 bg-[#ddd92a]"></div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ddd92a]"></div>
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                        No contact messages yet.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {contacts.map((contact) => (
                            <motion.div
                                key={contact._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`p-6 hover:bg-gray-50 cursor-pointer ${
                                    contact.status === 'new' ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => handleContactClick(contact)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                contact.status === 'new' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {contact.status === 'new' ? 'NEW' : 'READ'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                                        <p className="text-gray-700 line-clamp-2">{contact.message}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            {formatDate(contact.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {selectedContact && (
                // blurd background
                <div className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold">Message Details</h3>
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">From</label>
                                    <p className="mt-1 text-gray-900">{selectedContact.name}</p>
                                    <p className="text-gray-600">{selectedContact.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Message</label>
                                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Received</label>
                                    <p className="mt-1 text-gray-600">{formatDate(selectedContact.createdAt)}</p>
                                </div>

                                <div className="pt-4 border-t">
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                        selectedContact.status === 'new' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {selectedContact.status === 'new' ? 'Unread' : 'Read'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ContactManagement;