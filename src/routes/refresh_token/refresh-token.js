require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const refreshRoute = express.Router();
const { check, validationResult } = require('express-validator');
const connection = require('@root/db-connection');
const UserSchema = require('@root/src/schemas/user.schema');
const RefreshTokenSchema = require('../../schemas/refresh-token.schema');
const mongoose = require('mongoose');

async function main() {
	// create new refresh token
	refreshRoute.post(
		'/request',
		[
			check('email')
				.exists()
				.bail()
				.withMessage('email field must exist')
				.isEmail()
				.bail()
				.withMessage('email field must be email'),
			check('password')
				.exists()
				.bail()
				.withMessage('password field must exist')
				.isString()
				.bail()
				.withMessage('password must be string')
				.notEmpty()
				.bail()
				.withMessage('password field must not be empty'),
		],
		function (req, res, next) {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}

			const { email, password } = req.body;
			// check for validity of authentication information
			const UserModel = connection.model('User', UserSchema);
			UserModel.findOne({ email: email }, function (err, user) {
				if (err) return console.error(err);
				if (user == null) {
					res.status(400).json({ errors: [{ msg: 'Invalid email address.' }] });
					return;
				}

				// if program reaches here, that means we have to check for user's password
				if (!bcrypt.compareSync(password, user.passwordHash)) {
					// password validation fails in this scope
					res.status(400).json({ errors: [{ msg: 'Invalid password' }] });
					return;
				}

				// if the code reaches here, that means we have valid authentication.
				// generate newrefresh token, save it into database, and send it back to the client.
				const token = jwt.sign(
					{ email: email, date: Date.now() },
					process.env.REFRESH_TOKEN_SECRET,
					{ algorithm: 'HS256' }
				);

				// create refresh token model
				const RefreshTokenModel = connection.model(
					'RefreshToken',
					RefreshTokenSchema
				);

				// save the token into database
				RefreshTokenModel.insertMany([
					{
						_id: new mongoose.Types.ObjectId(),
						token: token,
						user: user._id,
					},
				]);

				// send the token back to the client
				res.status(200).json({ refreshToken: token });
			});
		}
	);

	// check for validity of the refresh token.
	refreshRoute.get('/validate', [], function (req, res, next) {});

	// delete one or all refresh tokens for given user, or token itself.
	refreshRoute.delete('/delete', [], function (req, res, next) {});

	module.exports = refreshRoute;
}

main();