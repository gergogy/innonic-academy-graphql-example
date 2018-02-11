Queries
----

#### Simple

```javascript
const xhr = new XMLHttpRequest()
xhr.responseType = 'json'
xhr.open("POST", "/graphql")
xhr.setRequestHeader("Content-Type", "application/json")
xhr.setRequestHeader("Accept", "application/json")
xhr.onload = function () {console.log('query simple:', this.response)}
xhr.send(JSON.stringify({query: "{ hello }"}))
```

#### Advanced

```javascript
const xhr2 = new XMLHttpRequest()
xhr2.responseType = 'json'
xhr2.open("POST", "/graphql")
xhr2.setRequestHeader("Content-Type", "application/json")
xhr2.setRequestHeader("Accept", "application/json")
xhr2.onload = function () {console.log('query advanced:', this.response)}
xhr2.send(JSON.stringify({
  query: `
    query GetAuthorWithBooks($incBooks: Boolean!) {
      author(id: 18541) {
        name
        ...BooksFragment
      }
    }

    fragment BooksFragment on Author {
      books @include(if: $incBooks) {
        id
        isbn
        title
      }
    }
  `,
  variables: {incBooks: true}
}))
```

Mutations
---

```javascript
const xhr3 = new XMLHttpRequest()
xhr3.responseType = 'json'
xhr3.open("POST", "/graphql")
xhr3.setRequestHeader("Content-Type", "application/json")
xhr3.setRequestHeader("Accept", "application/json")
xhr3.onload = function () {console.log('mutation:', this.response)}
xhr3.send(JSON.stringify({
  query: `
    mutation CreatePaste($in:CreatePasteInput!){
      createPaste(input: $in)
    }
  `,
  variables: {
    in: {
      title: "Test",
      privacy: "PRIVATE_USER",
      format: "SYNTAX_None",
      content: "Test"
    }
  }
}))
```