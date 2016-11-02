# Watson Talkify Classifier
IBM Watson NLP Classifier implementation for Talkify

[![Build Status](https://travis-ci.org/manthanhd/talkify-watson-classifier.svg?branch=master)](https://travis-ci.org/manthanhd/talkify-watson-classifier) [![Coverage Status](https://coveralls.io/repos/github/manthanhd/talkify-watson-classifier/badge.svg?branch=master)](https://coveralls.io/github/manthanhd/talkify-watson-classifier?branch=master)

# Usage

Install the Watson Talkify Classifier:

```shell
npm install --save talkify-watson-classifier
```

Once installed, you can create a new object instance of the classifier like so:

```javascript
var WatsonClassifier = require('talkify-watson-classifier');

var credentials = { 
                    username: 'my-watson-classifier-username', 
                    password: 'my-watson-classifier-password' 
                  };

var myWatsonClassifier = new WatsonClassifier('<watson-classifier-id>', credentials);
```

Pass the `myWatsonClassifier` object into the Talkify Bot.

```javascript
var options = {
                classifier: myWatsonClassifier
              };
var bot = new Bot(options);
```

Provided your credentials are correct and you have enough training data for Watson, it should work out of the box without needing any additional configuration.

Please note that training data through this library is not supported at the moment. Any help will be much appreciated in this regard. :smiley:

