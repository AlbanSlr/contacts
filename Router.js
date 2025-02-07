const express = require('express');
const Contact = require('./Contact');

module.exports = (app, fileContactService) => {
    const router = express.Router();

    // GET /rest/contacts - Get all contacts
    router.get('/contacts', (req, res) => {
        fileContactService.read((contacts) => {
            res.json(contacts);
        });
    });

    // GET /rest/contacts/:id - Get contact by ID
    router.get('/contacts/:id', (req, res) => {
        const id = parseInt(req.params.id, 10);
        fileContactService.read((contacts) => {
            const contact = contacts.find(contact => contact.id === id);
            if (contact) {
                res.json(contact);
            } else {
                res.status(404).json({ error: 'Contact not found' });
            }
        });
    });

    // POST /rest/contacts - Create a new contact
    router.post('/contacts', (req, res) => {
        const { lastName, firstName, adress, phone } = req.body;
        fileContactService.add(lastName, firstName, adress, phone, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error adding contact' });
            } else {
                res.status(201).json({ message: 'Contact added successfully' });
            }
        });
    });

    // PUT /rest/contacts/:id - Update a contact
    router.put('/contacts/:id', (req, res) => {
        const id = parseInt(req.params.id, 10);
        const { lastName, firstName, adress, phone } = req.body;
        fileContactService.delete(id, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error deleting contact' });
            } else {
                fileContactService.add(lastName, firstName, adress, phone, (err) => {
                    if (err) {
                        res.status(500).json({ error: 'Error adding contact' });
                    } else {
                        res.status(200).json({ message: 'Contact updated successfully' });
                    }
                });
            }
        });
    });

    app.use('/rest', router);
};