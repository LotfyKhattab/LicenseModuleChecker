// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone'),
    restyStone = require("resty-stone");
// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
keystone.init({
    'name': 'license watcher',
    'brand': 'HKM',

    'less': 'public',
    'static': 'public',
    'favicon': 'public/favicon.ico',
    'views': 'templates/views',
    'view engine': 'jade',

    'emails': 'templates/emails',

    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': '4yA`pC]_G=x?r.M%252*fn}i.$jtyj^(&*($*@(*((#IcUZ(23i9+S79BA$g'
});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
    _: require('underscore'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable
});
// Load your project's Routes
keystone.set('routes', require('./routes'));
// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.
keystone.set('email locals', {
    logo_src: '/images/logo-email.gif',
    logo_width: 194,
    logo_height: 76,
    theme: {
        email_bg: '#f9f9f9',
        link_color: '#2697de',
        buttons: {
            color: '#fff',
            background_color: '#2697de',
            border_color: '#1a7cb7'
        }
    }
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [
    {
        find: '/images/',
        replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
    },
    {
        find: '/keystone/',
        replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
    }
]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
    'users': 'users',
    'enquiries': 'enquiries',
    'pages': 'pages',
    'licenses': 'licenses',
    'product': 'product'
});

keystone.set('resty api base address', "/api"); // you can omit this line, it is the same as the default and here for demo only.
keystone.set('resty meta location', "./routes/api"); // provide the relative path from your project's root, to your Resource metadata folder.
keystone.set('resty auth type', restyStone.AUTH_TYPE.TOKEN); // keep KeystoneJS cookie based session for auth (use in dev only!)
keystone.set('resty token header', "api-token");
// Start Keystone to connect to your database and initialise the web server
keystone.start(restyStone.start());
