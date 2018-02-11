const { fetchAuthor, fetchBook, getPaste } = require('./fetchers')
const DataLoader = require('dataloader')

const authorLoader = new DataLoader(keys => Promise.all(keys.map(fetchAuthor)))
const bookLoader = new DataLoader(keys => Promise.all(keys.map(fetchBook)))
const pasteLoader = new DataLoader(keys => Promise.all(keys.map(getPaste)))

module.exports = {
  authorLoader,
  bookLoader,
  pasteLoader
}