const chalk = require('chalk').default;

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

module.exports = Contact;