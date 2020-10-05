// const fs = require('fs-extra');

// fs.copy('/home/pi/Documents/sites/react-wintertons/build/*', '/var/www/html')
//     .then(() => console.log('Success moving files'))
//     .catch(err => console.log(err))

var ncp = require('ncp').ncp;
 
ncp.limit = 16;
 
ncp('/home/pi/Documents/sites/react-wintertons/build/', '/var/www/html', function (err) {
 if (err) {
   return console.error(err);
 }
 console.log('done!');
});