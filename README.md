# passport-facebook

[![Build](https://img.shields.io/travis/cacothi/passport-facebook-signedrequest.svg)](https://travis-ci.org/cacothi/passport-facebook-signedrequest)
[![Coverage](https://img.shields.io/coveralls/cacothi/passport-facebook-signedrequest.svg)](https://coveralls.io/r/cacothi/passport-facebook-signedrequest)
[![Quality](https://img.shields.io/codeclimate/github/cacothi/passport-facebook-signedrequest.svg?label=quality)](https://codeclimate.com/github/cacothi/passport-facebook-signedrequest)
[![Dependencies](https://img.shields.io/david/jaredhanson/passport.svg)](https://github.com/jaredhanson/passport)


[Passport](http://passportjs.org/) strategy for authenticating with [Facebook](http://www.facebook.com/)
using the Access Token and Signed Request provided by the Client Facebook Login.

This module lets you authenticate using Facebook in your Node.js applications.
By plugging into Passport, Facebook authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

This module was developed based on the great solutions provided by Jared Hanson
using [Passport](http://passportjs.org) to authenticate with [Facebook](http://www.facebebook.com) using the OAuth 2.0 Api. For this Stratategy, please go to the [Original Reporitory](https://github.com/jaredhanson/passport-facebook)


## Install

    $ npm install passport-facebook-signedrequest

## Usage

#### Create an Application

Before using `passport-facebook`, you must register an application with
Facebook.  If you have not already done so, a new application can be created at
[Facebook Developers](https://developers.facebook.com/).  Your application will
be issued an app ID and app secret, which need to be provided to the strategy.
You will also need to configure a redirect URI which matches the route in your
application.

#### Configure Strategy

The Facebook SignedRequest authentication strategy authenticates users using a Facebook
Access Token and Signed Request provided by the client`s authentication.  The app ID and secret obtained when creating an application are supplied as options when creating the strategy.  

```js
passport.use(new FacebookSignedRequestStrategy({
    appID: FACEBOOK_APP_ID,
    appSecret: FACEBOOK_APP_SECRET
  },
  function(user, done) {
    if (user)
      return done(null, user);
    else
      return done (new Error('Token not valid'));
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'facebookSignedRequest'` strategy, to
authenticate requests.

```js
router.post('/login-fb', function (req, res) {
  passport.authenticate('facebookSignedRequest', function (err, user) {
    if (err)
      res.status(400).json(err.message);
    else
      res.status(200).json(user);
  })(req, res);
});
```

## Examples

I have published another [resporitory](https://github.com/cacothi/passport-facebook-signedrequest) which you can find an example of a Node running both Web Client and Server API within the same application.

[https://github.com/cacothi/passport-facebook-signedrequest](https://github.com/cacothi/passport-facebook-signedrequest)

## Contributing

#### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

The test suite covers 100% of the code base.  All new feature development is
expected to maintain that level.  Coverage reports can be viewed by executing:

```bash
$ make test-cov
$ make view-cov
```

## Support

#### Funding

This software is provided to you as open source, free of charge.  The time and
effort to develop and maintain this project is dedicated by [@cacothi](http://github.com/cacothi) inspired by [@jaredhanson](https://github.com/jaredhanson).

If you (or your employer) benefit from this project, please consider a financial
contribution.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Thiago Bernardes <[http://linkedin.com/in/thibernardes](http://linkedin.com/in/thibernardes)>

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/Yvd9YjwKSPgZDyhU2WASruNb/cacothi/passport-facebook-signedrequest'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/Yvd9YjwKSPgZDyhU2WASruNb/cacothi/passport-facebook-signedrequest.svg' />
</a>
