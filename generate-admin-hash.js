const crypto = require('crypto');

// Password to hash
const password = 'Mason@0905';

// Create a salt and hash the password
const salt = crypto.randomBytes(16).toString('hex');
crypto.scrypt(password, salt, 64, (err, derivedKey) => {
  if (err) throw err;
  
  // Format: hash.salt
  const hash = `${derivedKey.toString('hex')}.${salt}`;
  
  console.log('Generated hash:');
  console.log(hash);
  console.log('\nUse this hash in server/storage.ts for the admin user.');
});