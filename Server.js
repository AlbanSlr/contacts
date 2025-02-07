const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./Router');

module.exports = (fileContactService) => {
    const app = express();
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));

    // Use the router module
    router(app, fileContactService);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};