//計算阻擋剩餘時間(毫秒)
const blockTimeKeeper = (time) => Date.now() - new Date(time).getTime();

//顯示阻擋剩餘時間
exports.printWattlingTime = (user, blockTime) => {
  if (!user.tryLoginTime) throw Error('請確認tryLoginTime欄位的正確性');
  return Math.floor(
    (blockTime - blockTimeKeeper(user.tryLoginTime)) / (1000 * 60)
  );
};

//blockTime(鎖定時間), tryTimes(嘗試次數)
exports.loginBlock = (user, isCorrectPassword, blockTime, tryTimes) => {
  if (user && !isCorrectPassword) {
    user.tryLoginCount += 1;
  }

  //到達指定次數給予時間戳記
  if (user.tryLoginCount === tryTimes) {
    user.tryLoginTime = new Date();
  }

  //找不到使用者或時間戳記跳出
  if (!user || user.tryLoginCount < tryTimes) return false;

  //如果已到達設定阻擋時間
  if (blockTimeKeeper(user.tryLoginTime) >= blockTime) {
    user.tryLoginCount = 0;
    return false;
  }

  //dev 檢查
  if (blockTimeKeeper(user.tryLoginTime) < 0) {
    console.log('出現超過現在時間的戳記在DateBase');
  }

  //使用者登入次輸超過10次
  if (user.tryLoginCount >= tryTimes) {
    return true;
  }
};
