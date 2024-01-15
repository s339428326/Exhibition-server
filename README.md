### 展覽後端 API

### 後端平台管理人員(Heroku)

https://evening-hollows-08215-2bb8e1b9252d.herokuapp.com/

### Vercel

專案採用 React 打包作為靜態檔案, Vercel 平台 CSP 問題暫時無法正常顯示

### 使用角色分類

#### user(一般用戶)

#### partner(夥伴前台帳戶)

1. 工作人員管理 CRUD
2. 展覽票卷設置
3. 展覽資訊
   - 圖片
   - 地址
   - 展覽時間
   - 展覽標題
   - 展覽介紹

#### worker(公司帳戶)

1. 展覽主辦帳戶 CRUD
2. 個展覽販賣及營收資料統計
3. 展覽管理(RUD)
4. 公司內部員工帳戶管理
   - 圖片
   - 地址
   - 展覽時間
   - 展覽標題
   - 展覽介紹

### API 路由(router)

admin(管理者) 使用 auth protect Controller 替代
auth(憑證, 登入安全相關)
department(部門)
ec(綠界第三方金流 API)
exhibition(展覽)
host(展覽主辦方)
order(訂單)
partner(合作夥伴)
start(喚醒部署伺服器)
exhibition(展覽)
worker(公司內部員工)

### API controller

partnerController(合作夥伴)
authController(憑證, 登入安全相關)
workerController(公司)
ECpaymentController(綠界第三方金流 API)
exhibitionController(展覽)
errorController(全局 錯誤訊息)
handlerController(CRUD 生成工廠)

### Email 寄送

npm run dev => Email 使用 mailtrap
npm run prod => Email 使用 sendGrid
