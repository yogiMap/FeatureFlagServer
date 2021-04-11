import message from '../../utils/messages';

const getBaseList = (req, res) => {
  res.status(200).json(message.success('Get all base. Success', []));
};

export default getBaseList;
