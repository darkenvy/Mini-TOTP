require('dotenv').config();

var byteTable = [
  0xff, 0xff, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f,
  0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
  0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
  0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16,
  0x17, 0x18, 0x19, 0xff, 0xff, 0xff, 0xff, 0xff,
  0xff, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
  0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
  0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16,
  0x17, 0x18, 0x19, 0xff, 0xff, 0xff, 0xff, 0xff
];

function decodeB32(encoded) {
  var shiftIndex = 0,
      plainDigit = 0,
      plainChar,
      plainPos = 0;

  var decoded = new Buffer(Math.ceil(encoded.length * 5 / 8));

  /* byte by byte isn't as pretty as octet by octet but tests a bit
      faster. will have to revisit. */
  for(var i = 0; i < encoded.length; i++) {
    if(encoded[i] === 0x3d){ //'='
      break;
    }

      var encodedByte = encoded[i] - 0x30;

      if(encodedByte < byteTable.length) {
          plainDigit = byteTable[encodedByte];

          if(shiftIndex <= 3) {
              shiftIndex = (shiftIndex + 5) % 8;

              if(shiftIndex === 0) {
                  plainChar |= plainDigit;
                  decoded[plainPos] = plainChar;
                  plainPos++;
                  plainChar = 0;
              } else plainChar |= 0xff & (plainDigit << (8 - shiftIndex));
          } else {
              shiftIndex = (shiftIndex + 5) % 8;
              plainChar |= 0xff & (plainDigit >>> shiftIndex);
              decoded[plainPos] = plainChar;
              plainPos++;

              plainChar = 0xff & (plainDigit << (8 - shiftIndex));
          }
      } else {
        throw new Error('Invalid input - it is not base32 encoded string');
      }
  }

  return decoded.slice(0, plainPos);
}

// -------------------------------------------------------------------------- //

var key = process.env.KEY;
if (!key) throw new Error('No KEY specified in .env file');

const cleanedKey = key.replace(/\W+/g, '').toUpperCase();
const keyBuffer = new Buffer(cleanedKey);
const decodedKeyBuffer = decodeB32(keyBuffer);
const decodedKeyStringB64 = decodedKeyBuffer.toString('base64');

console.log(decodedKeyStringB64);
