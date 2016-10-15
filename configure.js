var paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AdfbZ5pgmgl_uFMn68pDOaEdaxC19yN50gV-GsHOiaWmVgdd-NCtaCG0-FgmYBxPBO1b-jiioUkOfq0z',
    'client_secret': 'EFqFEOciNN_bpOzl08E3jdDXRvModHCYP2F_WFgQzb4GPS-cTuA0aHTTaQ4OPSvrSGunqAz7LHxBCWaw',
    'headers' : {
		'custom': 'header'
    }
});
