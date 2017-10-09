var passport = require('passport-strategy'),
	util = require('util'),
	fb = require('fb');

/**
* `Strategy` constructor
* 
* The Facebook authentication strategy authenticates request based on the 
* Facebook access token and signed request provided by the client`s Facebook login.
* 
* Once the user login on Facebook in the client-side, the callback returns the AccessToken and SignedRequest
* for that session. Using the App ID and Secret, it`s possible to communicate with facebook to retrieve the 
* scoped data.
* 
* Note: is recommended to set the App ID and Secred on the process, but for dev purpose would be fine to use within
* the config file as per the demo.
* 
* Options:
*   - `appId`: It sets the Facebook App ID (required)
*   - `appSecret`: It define the Facebook App Secret (required)
*   - `userFields`: It defines which user`s fields the authentication should returns. Default: User`s Facebook ID
*   - `signedRequestExpiresIn`: It define when the Signed Request expires in minutes: Default: 20 
*   - `badAccessTokenMessage`: Custom message if the Access Token is invalid
*   - `badSignedRequestMessage`: Custom message if the Signed Request is invalid
*   - `badSignedRequestExpiredMessage`: Custom message if the Token has expired or is not valid
* 
* @param {object} options 
* @param {function} verify 
*/
function Strategy(options, verify) {
	if (!options || typeof options !== 'object') {
		throw new Error('Facebook Signed Request Strategy requires to be initialized with options');
	}
	if (typeof verify !== 'function') {
		throw new Error('Facebook Signed Request Strategy requires a verify callback');
	}

	if (!options.appId) {
		throw new Error('Facebook Signed Request Strategy options require an AppID');
	}

	if (!options.appSecret) {
		throw new TypeError('Facebook Signed Request Strategy options require a secret');
	}

	this._fb = new fb.Facebook({ appId: options.appId, appSecret: options.appSecret });

	passport.Strategy.call(this);
	this.name = 'facebookSignedRequest';
	this._verify = verify;
	this._userFields = options.userFields;
	this._signedRequestExpiresIn = options.signedRequestExpiresIn || 20;
	this._badAccessTokenMessage = options.badAccessTokenMessage;
	this._badSignedRequestMessage = options.badSignedRequestMessage;
	this._badSignedRequestExpiredMessage = options.badSignedRequestExpiredMessage;

	this._accessTokenField = options.accessTokenField || 'accessToken';
	this._signedRequestField = options.signedRequestField || 'signedRequest';
}

// Inherit from Passport Strategy
util.inherits(Strategy, passport.Strategy);

/**
* Authenticate the User`s AccessToken and Signed Request based on the AppSecret
* 
* @param {http.IncomingMessage} req 
* @param {object} options
*/
Strategy.prototype.authenticate = function (req, options) {
	options = options || {};
	let accessToken = options.accessToken || req.body[this._accessTokenField];
	const signedRequestToken = options.signedRequest || req.body[this._signedRequestField];

	if (!accessToken) {
		throw new Error(this._badAccessTokenMessage || `Facebook not logged in (AccessToken not defined on the post body: ${this._accessTokenField})`);
	}

	if (!signedRequestToken) {
		throw new Error(this._badSignedRequestMessage || `Facebook not logged in (Signed Request not defined on the post body: ${this._signedRequestField})`);
	}


	try {
		const signedRequest = this._fb.parseSignedRequest(signedRequestToken);

		this._fb.setAccessToken(accessToken);

		const self = this;

		this.verified = function (err, user, info) {
			if (err) {
				return self.error(err);
			}
			if (!user) {
				return self.fail(info);
			}
			self.success(user, info);
		}

		if (!this._userFields) {
			if (!signedRequest || !signedRequest.user_id) {
				throw new Error(this._badSignedRequestMessage || 'User not authenticated');
			}

			if (this._signedRequestExpiresIn && typeof this._signedRequestExpiresIn === 'number' && this._signedRequestExpiresIn > 0) {
				const issuedAt = signedRequest.issued_at * 1000;
				const time = this._signedRequestExpiresIn * 60 * 1000;
				const expiredDate = issuedAt + time;
				const current = new Date().getTime();
				if (expiredDate < current)
					throw new Error(this._badSignedRequestExpiredMessage || 'The Facebook session has expired');
			}

			return self._verify({ id: signedRequest.user_id }, this.verified);
		}

		this._fb.api(`/me?fields=${self._userFields}`, function (response) {
			self._verify(response, self.verified);
		});
	} catch (ex) {
		return self.error(ex);
	}
};

/**
* Expose `Strategy`.
*/
module.exports = Strategy;
