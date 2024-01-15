//使用callback 技巧 回乎fn函示catch next task
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
