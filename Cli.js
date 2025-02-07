const yargs = require('yargs');
const ContactService = require('./ContactService');
const server = require('./Server');

module.exports = (fileContactService) => {
    yargs
        .command('list', 'List all contacts', {
            colors: {
                describe: 'Use colors in output',
                type: 'boolean',
                default: true
            }
        }, (argv) => {
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
            fileContactService.delete(argv.id, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log('Contact deleted successfully');
                }
            });
        })
        .command('watch', 'Watch for changes in contacts.json', {}, () => {
            fileContactService.watch((differences) => {
                console.log('Changes detected:', differences);
            });
        })
        .command('serve', 'Start a web server to list contacts', {}, () => {
            server(fileContactService);
        })
        .help()
        .argv;
};