const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk').default;
const yargs = require('yargs');

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

class Contact {
    constructor(id, lastName, firstName, adress, phone) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.adress = adress;
        this.phone = phone;
    }

    toString(useColors) {
        if (useColors) {
            return `${chalk.blue(this.lastName.toUpperCase())} ${chalk.red(this.firstName)}`;
        } else {
            return `${this.lastName.toUpperCase()} ${this.firstName}`;
        }
    }
}

class ContactService {
    constructor(contacts) {
        this.contacts = contacts;
    }

    get() {
        return this.contacts;
    }

    print(useColors) {
        this.contacts.forEach(contact => console.log(contact.toString(useColors)));
    }
}

// arg --no-colors is automatically added by yargs
const argv = yargs
    .command('list', 'List all contacts', {
        colors: {
            describe: 'Use colors in output',
            type: 'boolean',
            default: true
        }
    }, (argv) => {
        const fileContactService = new FileContactService();
        fileContactService.read((contacts) => {
            const contactService = new ContactService(contacts);
            contactService.print(argv.colors);
        });
    })
    .command('add', 'Add a new contact', {
        lastName: {
            describe: 'Last name of the contact',
            demandOption: true,
            type: 'string'
        },
        firstName: {
            describe: 'First name of the contact',
            demandOption: true,
            type: 'string'
        },
        adress: {
            describe: 'Address of the contact',
            demandOption: true,
            type: 'string'
        },
        phone: {
            describe: 'Phone number of the contact',
            demandOption: true,
            type: 'string'
        }
    }, (argv) => {
        const fileContactService = new FileContactService();
        fileContactService.add(argv.lastName, argv.firstName, argv.adress, argv.phone, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log('Contact added successfully');
            }
        });
    })
    .command('delete', 'Delete a contact', {
        id: {
            describe: 'ID of the contact to delete',
            demandOption: true,
            type: 'number'
        }
    }, (argv) => {
        const fileContactService = new FileContactService();
        fileContactService.delete(argv.id, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log('Contact deleted successfully');
            }
        });
    })
    .command('watch', 'Watch for changes in contacts.json', {}, () => {
        const fileContactService = new FileContactService();
        fileContactService.watch((differences) => {
            console.log('Changes detected:', differences);
        });
    })
    .help()
    .argv;