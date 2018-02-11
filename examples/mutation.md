Mutation examples
---

```
mutation CreatePaste($in:CreatePasteInput!) {
  createPaste(input:$in)
}
```

*Variables*:
```javascript
{
  "in": {
    "title": "Test var",
    "privacy": "PRIVATE_USER",
    "format": "SYNTAX_C",
    "content": "Test"
  }
}
```