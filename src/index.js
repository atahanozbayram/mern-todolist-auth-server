require('module-alias/register');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const apiRoute = require('./routes/api');

async function main() {
	const app = express();
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use('/api', apiRoute);

	const port = process.env.PORT || 5000;
	app.listen(port, () => {
		console.log('auth server started to listen on port %d', port);
	});
}

main();
