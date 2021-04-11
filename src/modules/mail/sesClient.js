import AWS from 'aws-sdk';
import message from '../utils/messages';

const AWS_SES_ACCESS_KEY_ID = process.env.AWS_SES_ACCESS_KEY_ID;
const AWS_SES_SECRET_ACCESS_KEY = process.env.AWS_SES_SECRET_ACCESS_KEY;
const AWS_SES_FROM = process.env.AWS_SES_FROM;
const AWS_SES_REGION = process.env.AWS_SES_REGION;
const MAIL_SILENT = process.env.MAIL_SILENT;

AWS.config.update({
  accessKeyId: AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: AWS_SES_SECRET_ACCESS_KEY,
  region: AWS_SES_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const sendEmailViaAwsSes = (to, subject, emailMessage) => {
  if (MAIL_SILENT === 'true') {
    return message.success('Silent mode');
  }

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: emailMessage.html,
        },
        Text: {
          Charset: 'UTF-8',
          Data: emailMessage.text,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    ReturnPath: AWS_SES_FROM,
    Source: AWS_SES_FROM,
  };

  const sendEmail = ses.sendEmail(params).promise();

  return sendEmail
    .then((data) => {
      console.log(data);
      return message.success('Email is sent', data);
    })
    .catch((error) => {
      return message.fail('Email is not sent', error);
    });
};

export default sendEmailViaAwsSes;
