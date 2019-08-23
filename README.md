# MiniTOTP
I use this so I can generate TOTP auth codes from the terminal


This application is split in two parts: the key preparer and the executor. This is to make the execution code much smaller.

## how to
* Place your Private key in `KEY` inside `.end`
* `node prepareKey.js`
* place result in local environement. `export B64_KEY=XXXXXX`
* run `node index.js`

## minified
Index.min.js is a hand minifid file for extra-small applications.
