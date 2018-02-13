const translate = require('./translate')
const loaders = require('./loaders')
const pasteBin = require('./pastebin/adapter')
const sortDirs = {
  ASC: 0,
  DESC: 1
}
const userLevelToType = ['FREE', 'PRO']
const privacyLevelToPrivacy = ['PUBLIC', 'UNLISTED', 'PRIVATE']
const pastebinPrivacy = [
  'PUBLIC_ANON',
  'UNLISTED_ANON',
  'PRIVATE_USER',
  'PUBLIC_USER'
]
const pastebinFormats = require('./pastebin/formats')
const Kind = require('graphql/language').Kind

module.exports = {
  Date: {
    serialize: value => {
      if (!(value instanceof Date)) {
        throw new TypeError(`Value is a '${typeof value}' instead of 'Date'`)
      }

      return value.getTime()
    },

    parseValue: value => {
      const date = new Date(value)

      if (isNaN(date.getTime())) {
        throw new TypeError(`${value} is not a valid 'Date'`);
      }

      return date;
    },

    parseLiteral: AST => { // Abstract Syntax Tree
      if (AST.kind !== Kind.STRING) {
        throw new GraphQLError(`Can only parse strings to dates but got a: ${AST.kind}`)
      }

      const date = new Date(AST.value)

      if (isNaN(date.getTime())) {
        throw new GraphQLError(`${AST.value} is not a valid 'Date'`)
      }

      if (AST.value !== date.toISOString()) {
        throw new GraphQLError(`Value is not a valid ISO format: ${AST.value}`);
      }

      return date
    }
  },
  Book: {
    id: xml => xml.GoodreadsResponse.book[0].id[0],
    title: (xml, { lang }) => {
      const title = xml.GoodreadsResponse.book[0].title[0]
      return lang ? translate(lang, title) : title
    },
    isbn: xml => xml.GoodreadsResponse.book[0].isbn[0],
    authors: (xml, { sortDir }) => {
      const authorElements = xml.GoodreadsResponse.book[0].authors[0].author
      const ids = authorElements.map(elem => elem.id[0])
      let authors = loaders.authorLoader.loadMany(ids)

      if (sortDir) {
        authors.then(writers => {
          authors = writers.sort((a, b) => {
            const aName = a.GoodreadsResponse.author[0].name[0]
            const bName = b.GoodreadsResponse.author[0].name[0]

            return sortDirs[sortDir] === sortDirs.DESC
              ? bName.localeCompare(aName)
              : sortDirs[sortDir] === sortDirs.ASC
                ? aName.localeCompare(bName)
                : 0
          })
        })
      }

      return authors
    }
  },
  Author: {
    name: xml => xml.GoodreadsResponse.author[0].name[0],
    books: xml => {
      const ids = xml.GoodreadsResponse.author[0].books[0].book.map(elem => elem.id[0]._)
      const books = loaders.bookLoader.loadMany(ids)
      return books
    }
  },
  PastebinPasteDetailed: {
    id: data => data.paste_key,
    date: data => new Date(parseInt(data.paste_date, 10)*1000),
    title: data => data.paste_title.length ? data.paste_title : null,
    privacy: data => privacyLevelToPrivacy[parseInt(data.paste_private)],
    hits: data => data.paste_hits,
    url: data => data.paste_url,
    content: data => loaders.pasteLoader.load(data.paste_key)
  },
  UserInfo: {
    username: data => data.user_name,
    avatar: data => data.user_avatar_url,
    website: data => data.user_website.length ? data.user_website : null,
    email: data => data.user_email,
    location: data => data.user_location,
    type: data => userLevelToType[data.user_account_type]
  },
  Query: {
    hello: () => "Hello World!",
    author: (_, { id }) => loaders.authorLoader.load(id),
    book: (_, { id }) => loaders.bookLoader.load(id),
    paste: (_, { id }) => loaders.pasteLoader.load(id),
    listUserPastes: (_, { limit }) => pasteBin.listUserPastes(limit),
    listTrendingPastes: (_, { count }, ctx) => ctx.app.get('pasteTrends').slice(0, count),
    pastebinUserInfo: (_, __, ctx) => ctx.app.get('userInfo'),
    toTimestamp: (_, { date }) => new Date(date)
  },
  Mutation: {
    createPaste: (_, { input }) =>
      pasteBin.createPaste(input.content, input.title, pastebinFormats[input.format], pastebinPrivacy.indexOf(input.privacy))
        .then(res => loaders.pasteLoader.load(res.split('/').reverse()[0])),
    deletePaste: (_, { id }) => pasteBin.deletePaste(id)
  }
}