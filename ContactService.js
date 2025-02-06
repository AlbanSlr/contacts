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

module.exports = ContactService;