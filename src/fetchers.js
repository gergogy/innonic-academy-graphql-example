const fetch = require('node-fetch')
const { goodreadsApiKey } = require('../config')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const apiDomain = 'https://www.goodreads.com'
const pasteBin = require('./pastebin/adapter')

const fetchAuthor = id =>
  fetch(`${apiDomain}/author/show.xml?id=${id}&key=${goodreadsApiKey}`)
    .then(response => response.text())
    .then(parseXML)

const fetchBook = id =>
  fetch(`${apiDomain}/book/show/${id}.xml?key=${goodreadsApiKey}`)
    .then(response => response.text())
    .then(parseXML)

const getPaste = id => pasteBin.getPaste(id)

module.exports = {
  fetchAuthor,
  fetchBook,
  getPaste
}