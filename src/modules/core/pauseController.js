const pauseController = (req, res, next) => {
  setTimeout(() => next(), 0);
};

export default pauseController;
