const PastebinAPI = require('pastebin-js')
const { pastebinDevKey, pastebinUsername, pastebinPassword} = require('../../config')
const pasteBin = new PastebinAPI({
  'api_dev_key' : pastebinDevKey,
  'api_user_name' : pastebinUsername,
  'api_user_password' : pastebinPassword
 });

 module.exports = pasteBin