import User from '../userModel';
import message from '../../utils/messages';
import { get } from 'lodash';
import analytics from '../../analytics/controllers/analytics';

const userSearch = async (req, res) => {
  const name = get(req, 'body.name', '');
  const id = get(req, 'body.id', '');
  const email = get(req, 'body.email', '');
  const phone = get(req, 'body.phone', '');
  const group = get(req, 'body.group', '');
  const role = get(req, 'body.role', '');

  let limit = get(req, 'body.limit', 10);
  limit = limit > 100 ? 100 : limit;
  const page = get(req, 'body.page', 1);

  const search = [
    {
      name: { $regex: name, $options: 'i' },
    },
  ];

  if (id) {
    search.push({
      _id: id,
    });
  }

  if (email) {
    search.push({
      email: { $regex: email, $options: 'i' },
    });
  }

  if (phone) {
    search.push({
      phone: { $regex: phone, $options: 'i' },
    });
  }

  if (group) {
    search.push({
      groups: { $in: [group] },
    });
  }

  if (role) {
    search.push({
      roles: { $in: [role] },
    });
  }

  try {
    const totalCountPromise = User.countDocuments({ $and: search });
    const userSearchQueryPromise = userSearchQuery({ search, page, limit }); // 100

    const PromiseAllResult = await Promise.all([
      totalCountPromise,
      userSearchQueryPromise,
    ]);

    const totalCount = PromiseAllResult[0];
    const userSearchResult = PromiseAllResult[1];

    const pageCount = Math.ceil(totalCount / limit);

    const result = {
      pagination: {
        pageCurrent: page,
        pageCount,
        limit,
        itemsCount: totalCount,
        isFirst: page === 1,
        isLast: page === pageCount,
      },
      items: userSearchResult,
    };

    res.status(200).json(result);
  } catch (error) {
    const analyticsId = analytics('USER_SEARCH_ERROR', {
      error,
      body: get(req, 'body'),
      controller: 'userSearch',
    });

    res.status(400).json(message.fail('User search. Error', analyticsId));
  }
};

export default userSearch;

function userSearchQuery({ search, page, limit }) {
  return User.find({ $and: search })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .populate({
      path: 'groups',
      select: 'name',
    })
    .select('-__v -codewarsAnalytics -resetPassword')
    .exec()
    .then((docs) => docs)
    .catch((error) => error);
}
