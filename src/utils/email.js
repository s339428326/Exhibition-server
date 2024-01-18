//3-rd plugin
const ejs = require('ejs');
const { htmlToText } = require('html-to-text');
const nodemailer = require('nodemailer'); //https://nodemailer.com/about/

// new Email(user, url).sendWelcome();
//user => req.user
//url => API
//method sendWelcome => send email to user email say hi ! prototype

module.exports = class Email {
  constructor(user, url) {
    this.to = user?.email;
    this.firstName = user?.username;
    this.url = url;
    this.form = `Exhibition office <${process.env.EMAIL_FROM_PROD}>`;
  }

  //隱私方法
  newTransport() {
    //
    if (process.env.NODE_ENV === 'production') {
      // 使用SendGrid SMTP 方式
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    }

    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: process.env?.EMAIL_PORT,
      auth: {
        user: process.env?.EMAIL_USERNAME,
        pass: process.env?.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * 隱私方法
   * @param {String} template : EJS template Choose src/template/email/{template}.ejs
   * @param {String} subject
   */
  async send(template, subject, content, to, bcc) {
    console.log(template);
    const htmlFile = await ejs.renderFile(
      `${__dirname}/../assets/template/email/email.ejs`,
      {
        template,
        url: `${this.url}`,
        firstName: this.firstName,
        subject,
        content,
      }
    );

    let mailOption = {
      from: this.form,
      subject,
      html: htmlFile,
      text: htmlToText(htmlFile),
    };

    if (to) mailOption = { ...mailOption, to };
    if (bcc) mailOption = { ...mailOption, bcc };

    //3. Create a transport and send email
    await this.newTransport().sendMail(mailOption);
  }

  async sendPartnerEmail(template, subject, to) {
    const htmlFile = await ejs.renderFile(
      `${__dirname}/../assets/template/email/email.ejs`,
      {
        template,
        url: `${this.url}`,
        subject,
        firstPassword: to?.firstPassword,
      }
    );

    let mailOption = {
      from: this.form,
      subject,
      to: to?.company?.email,
      html: htmlFile,
      text: htmlToText(htmlFile),
    };
    await this.newTransport().sendMail(mailOption);
  }

  /**
   * 隱私方法
   * 暫時不使用信箱服務無法承受單一用戶, 連續發送
   * @param {String} template : EJS template Choose src/template/email/{template}.ejs
   * @param {String} subject
   */
  async sendMultiple(template, subject, content, users) {
    const htmlFile = await ejs.renderFile(
      `${__dirname}/../assets/template/email/email.ejs`,
      {
        template,
        url: `${this.url}`,
        firstName: this.firstName,
        subject,
        content,
      }
    );

    const mailOption = {
      from: this.form,
      subject,
      html: htmlFile,
      text: htmlToText(htmlFile),
    };

    //3. Create a transport and send email
    users.forEach(async (email) => {
      await this.newTransport().sendMail({ ...mailOption, to: email });
    });
  }

  //新增信箱Template 內容
  //template(EJS Template Name, subject), call this class send
  //前台信件
  async sendWelcome(user) {
    await this.send('welcome', '歡迎使用 Search Art Fair!', null, user, null);
  }

  async sendResetPassword(user) {
    await this.send(
      'forgetPassword',
      'Search Art Fair 更換密碼',
      null,
      user,
      null
    );
  }

  async sendChangeEmail(user) {
    await this.send('changeEmail', '更換綁定信箱', null, user, null);
  }

  //後台信件
  async sendPlatformEmail(subject, content, users) {
    await this.send('platformEmail', subject, content, null, users);
  }

  async sendPartnerActiveEmail(partner) {
    await this.sendPartnerEmail(
      'partnerActive',
      'Search Art Fair 夥伴帳戶已啟用',
      partner
    );
  }
};
