const crypto = require('crypto'); // built-in official node package.
require('dotenv').config();

function hexToBytes(hex) {
	var bytes = [];
	for(var c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
	return bytes;
}

function intToBytes(num) {
	var bytes = [];
	for(var i=7 ; i>=0 ; --i) {
		bytes[i] = num & (255);
		num = num >> 8;
	}
	return bytes;
}

function hotpGen(key='', opt) {
	var h = hexToBytes(crypto.createHmac('sha1', new Buffer(key)).update(new Buffer(intToBytes(opt.counter))).digest('hex'));
	var offset = h[19] & 0xf;
	var v = (h[offset] & 0x7f) << 24 |
		(h[offset + 1] & 0xff) << 16 |
		(h[offset + 2] & 0xff) << 8  |
		(h[offset + 3] & 0xff)
	return (v+='').substr(v.length - 6, 6);
}

// Generate a Google Auth Token
const getToken = key => hotpGen(
  key,
  {counter: Math.floor((new Date().getTime() / 1000) / 30)}
);

// -------------------------------------------------------------------------- //

const key = process.env.B64_KEY;
if (!key) throw new Error('No B64_KEY in .env');
var token = getToken(Buffer.from(key, 'base64'));

console.log(token);
