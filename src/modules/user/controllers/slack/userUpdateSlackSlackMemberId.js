import message from '../../../utils/messages';
import { get } from 'lodash';
import getSlackUserByEmail from '../../../slack/getSlackUserByEmail';
import userGetByIdQuery from '../../queries/getById';
import userUpdateByIdQuery from '../../queries/updateById';
import analytics from '../../../analytics/controllers/analytics';

const userUpdateSlackMemberId = async (req, res) => {
  const { userId } = req.params;

  // get user by id to get email
  const getUserByIdResult = await userGetByIdQuery(userId);
  const email = get(getUserByIdResult, 'payload.email', null);

  if (getUserByIdResult.success && email) {
    // if user ok and has email send request to slack API to get user from slack
    const getSlackUserByEmailResult = await getSlackUserByEmail(email);

    if (
      getSlackUserByEmailResult.success &&
      get(getSlackUserByEmailResult, 'payload.ok', false)
    ) {
      // if slack returns user -> update user and save slack member id
      const slackMemberId = get(getSlackUserByEmailResult, 'payload.user.id');

      const updateUserResult = await userUpdateByIdQuery({
        userId,
        values: { 'links.slackMemberId': slackMemberId },
      });

      if (updateUserResult.success) {
        //
        analytics('USER_UPDATE_SLACK_MEMBER_ID_SUCCESS', {
          email,
          user: userId,
        });

        res.status(200).json(message.success('Slack member id saved to user'));
      } else {
        const reason = 'User update by id fail';

        const analyticsId = analytics('USER_UPDATE_SLACK_MEMBER_ID_FAIL', {
          reason,
          email,
          user: userId,
        });

        res
          .status(400)
          .json(message.fail('Slack member id does not saved to user', analyticsId));
      }
    } else {
      const slackErrorMessage = get(getSlackUserByEmailResult, 'payload.error');

      const analyticsId = analytics('USER_UPDATE_SLACK_MEMBER_ID_ERROR', {
        slackErrorMessage,
        email,
        user: userId,
        controller: 'userUpdateSlackMemberId',
      });

      res
        .status(400)
        .json(
          message.fail(
            'Update slack member id error. Get slack by email error',
            analyticsId,
          ),
        );
    }
  } else {
    const reason = 'User not found';

    const analyticsId = analytics('USER_UPDATE_SLACK_MEMBER_ID_ERROR', {
      reason,
      req,
      controller: 'userUpdateSlackMemberId',
    });
    res
      .status(400)
      .json(
        message.fail('Update slack member id error. User get by id error', analyticsId),
      );
  }

  // userUpdateByIdQuery
};

export default userUpdateSlackMemberId;
