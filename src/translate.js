const fetch = require('node-fetch')
const { translateApiKey } = require('../config')

module.exports = (lang, str) =>
  fetch(`https://www.googleapis.com/language/translate/v2?key=${translateApiKey}&source=en&target=${lang}&q=${encodeURIComponent(str)}`)
 		.then(response => response.json())
	  .then(parsedResponse =>
    	parsedResponse
      	.data
        .translations[0]
        .translatedText
    )
