/**
 * Created by manthanhd on 01/11/2016.
 */
function WatsonClassifier(classifierId, credentials) {
    if(!classifierId) throw new TypeError('classifierId must be defined');
    if(!credentials) throw new TypeError('credentials object must be defined');
    if(!credentials.username) throw new TypeError('username attribute in the credentials object must be defined');
    if(!credentials.password) throw new TypeError('password attribute in the credentials object must be defined');

    const NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

    const natural_language_classifier = new NaturalLanguageClassifierV1({
        username: credentials.username,
        password: credentials.password
    });

    this.getClassifications = function GetClassificationsFn(text, callback) {
        natural_language_classifier.classify({
                text: text,
                classifier_id: classifierId
            },
            function (err, response) {
                if(err) return callback(err);

                var classes = response.classes;
                var classifications = [];
                classes.forEach(function(classification) {
                    classifications.push({label: classification.class_name, value: classification.confidence});
                });

                return callback(undefined, classifications);
            });

        return this;
    };

    this.train = function TrainFn() {
        throw new Error('Training Watson Classifier from this library is not yet supported.');
    };

    this.addDocument = function AddDocumentFn() {
        throw new Error('Training Watson Classifier from this library is not yet supported.');
    };
}

module.exports = WatsonClassifier;