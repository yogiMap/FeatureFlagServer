import User from '../userModel';
import message from '../../utils/messages';

const userStats = async (req, res) => {
  const today = new Date();
  const day = 86400000; // Milliseconds in a day
  const tenDaysAgo = new Date(today - 10 * day);

  const total = await User.countDocuments({});
  const students = await User.countDocuments({ roles: { $in: ['new'] } });

  const registeredLast10Days = await User.countDocuments({
    createdAt: { $gt: tenDaysAgo },
  });

  if (total) {
    const usersAllStats = { total, students, registeredLast10Days };
    res.status(200).json(message.success('Get User Stats. Success', usersAllStats));
  } else {
    res.status(400).json(message.fail('Get User Stats. Error'));
  }
};

export default userStats;
