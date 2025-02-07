const FileContactService = require('./FileContactService');
const cli = require('./Cli');
const server = require('./Server');

const fileContactService = new FileContactService();
cli(fileContactService);
console.log('Server is running');