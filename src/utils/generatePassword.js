const generatePassword = (len) => {
  const str =
    'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';
  let password = '';
  for (let i = 0; i < len; i++) {
    const random = Math.floor(Math.random() * str.length);
    password += str[random];
  }
  return password;
};

module.exports = generatePassword;
