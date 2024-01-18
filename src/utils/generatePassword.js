const generatePassword = (len) => {
  const eng = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const num = '0123456789';
  let password = '';
  for (let i = 0; i < len; i++) {
    let str = eng + num;
    if (i === 0) str = eng;
    if (i === 1) str = num;
    const random = Math.floor(Math.random() * str.length);
    password += str[random];
  }
  return password;
};

module.exports = generatePassword;
