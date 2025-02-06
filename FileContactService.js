const fs = require('fs');
const _ = require('lodash');
const Contact = require('./Contact');

const path = 'contacts.json';

class FileContactService {
    read(callback) {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                callback([]);
            } else {
                const contactsData = JSON.parse(data);
                const contacts = contactsData.map(contact => new Contact(contact.id, contact.lastName, contact.firstName, contact.adress, contact.phone));
                callback(contacts);
            }
        });
    }

    write(contacts, callback) {
        const data = JSON.stringify(contacts, null, 2);
        fs.writeFile(path, data, 'utf8', callback);
    }

    add(lastName, firstName, adress, phone, callback) {
        this.read((contacts) => {
            const newId = contacts.length > 0 ? Math.max(...contacts.map(contact => contact.id)) + 1 : 1;
            const newContact = new Contact(newId, lastName, firstName, adress, phone);
            contacts.push(newContact);
            this.write(contacts, callback);
        });
    }

    delete(id, callback) {
        this.read((contacts) => {
            _.remove(contacts, contact => contact.id === id);
            this.write(contacts, callback);
        });
    }

    watch(callback) {
        fs.watch(path, (eventType, filename) => {
            if (filename && eventType === 'change') {
                this.read((newContacts) => {
                    this.read((oldContacts) => {
                        const differences = _.differenceWith(newContacts, oldContacts, _.isEqual);
                        callback(differences);
                    });
                });
            }
        });
    }
}

module.exports = FileContactService;