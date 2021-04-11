import { difference, upperFirst } from 'lodash';
import sendEmailViaAwsSes from '../../mail/sesClient';

export async function notifyAboutNewRole({ currentRoles, newRoles, email, name }) {
  const newRole = difference(newRoles, currentRoles).filter((el) => el !== 'new')[0];

  if (newRole) {
    const appLink = 'https://app.pasv.us';
    const extraMessage = extraMessageForLearner(newRole);

    const emailMessage = {
      html: `Hi ${name},<br/>
          You got a new role – ${upperFirst(newRole)}
          <br/><br/>
          Check your account for updates. <a href=${appLink}>Go to app</a>
          <br/><br/>
          ${extraMessage.html}
          Thanks,<br/>
          Your friends at Feature-Flag`,
      text: `Hi ${name},\nYou got a new role – ${upperFirst(
        newRole,
      )}\n\nCheck your account for updates. Go to ${appLink}\n\n${
        extraMessage.text
      }Thanks,\nYour friends at Feature-Flag`,
    };

    const subject = '[Feature-Flag] New role';

    await sendEmailViaAwsSes(email, subject, emailMessage);
  }
}

function extraMessageForLearner(role) {
  if (role === 'learner') {
    return {
      html: `In the Courses section, start taking the free Syntax JavaScript course.<br/>
          <strong>Enrollment in any paid courses is possible only after passing<br/>
          the JavaScript Syntax course (no less than 90% of completion).</strong>
          <br/><br/>`,
      text:
        'In the Courses section, start taking the free Syntax JavaScript course.\nEnrollment in any paid courses is possible only after passing\nthe JavaScript Syntax course (no less than 90% of completion).\n\n',
    };
  }
  return { html: '', text: '' };
}
