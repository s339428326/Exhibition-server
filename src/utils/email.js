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
    this.to = user.email;
    this.firstName = user.username;
    this.url = url;
    this.form = `Exhibition office <${process.env.EMAIL_FROM_PROD}>`;
  }

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
   *
   * @param {FileName} content : EJS template Choose src/template/email/{content}.ejs
   * @param {String} subject
   */
  async send(content, subject) {
    console.log(`${__dirname}/../assets/template/email/email.ejs`);
    const htmlFile = await ejs.renderFile(
      `${__dirname}/../assets/template/email/email.ejs`,
      {
        firstName: this.firstName,
        url: `${this.url}`,
        subject,
        content,
      }
    );

    const mailOption = {
      from: this.form,
      to: this.to,
      subject,
      html: htmlFile,
      text: htmlToText(htmlFile),
    };

    //3. Create a transport and send email
    await this.newTransport().sendMail(mailOption);
  }

  //新增信箱Template 內容
  //template(EJS Template Name, subject), call this class send
  async sendWelcome() {
    await this.send('welcome', '歡迎使用 Search Art Fair!');
  }

  async sendResetPassword() {
    await this.send('forgetPassword', 'Search Art Fair 更換密碼');
  }

  async sendChangeEmail() {
    await this.send('changeEmail', '更換綁定信箱');
  }
};
