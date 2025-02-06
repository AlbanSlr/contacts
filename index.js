const FileContactService = require('./FileContactService');
const cli = require('./Cli');

const fileContactService = new FileContactService();
cli(fileContactService);