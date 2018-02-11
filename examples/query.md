Example queries
---

```
{
  hello
}
```

```
{
  listTrendingPastes {
    id
    title
  }
}
```

```
{
  listTrendingPastes(count: 1) {
    id
    title
  }
}
```

```
query InefficientQuery($authorId: ID!) {
  author(id: $authorId) {
    name
    books {
      ...BookDetails
      authors {
        books {
          ...BookDetails
          authors {
            books {
              ...BookDetails
            }
          }
        }
      }
    }
  }
}

fragment BookDetails on Book {
  id
  isbn
  title
}
```

```
query GetAuthorWithBooks($incBooks: Boolean = false) {
  author(id: 18541) {
    name
    books @include(if: $incBooks) {
      ...BookDetails
    }
  }
}

fragment BookDetails on Book {
  id
  isbn
  title
}
```
