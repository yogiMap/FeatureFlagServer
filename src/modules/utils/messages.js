const message = {};

message.success = (text = '', payload, silent = true) => ({
  message: text,
  success: true,
  fail: false,
  silent,
  payload,
});

message.fail = (text = '', payload, silent = false) => ({
  message: text,
  success: false,
  fail: true,
  silent,
  payload,
});

export default message;
