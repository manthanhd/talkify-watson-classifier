/**
 * Created by manthanhd on 01/11/2016.
 */

const expect = require('expect');
const mockery = require('mockery');
const REQUIRE_WATSON_DEV_CLOUD_NLP_V1 = 'watson-developer-cloud/natural-language-classifier/v1';

describe('WatsonClassifier', function () {

    beforeEach(function (done) {
        mockery.enable({warnOnUnregistered: false, warnOnReplace: false});
        done();
    });

    afterEach(function (done) {
        mockery.deregisterAll();
        mockery.disable();
        done();
    });

    describe('<init>', function () {
        it('fails to initialize when classifierId parameter is missing', function (done) {
            const WatsonClassifier = require('../lib/WatsonClassifier');
            try {
                new WatsonClassifier(undefined);
                return done('should have failed');
            } catch (e) {
                expect(e).toBeA(TypeError);
                expect(e.message).toBe('classifierId must be defined');
                return done();
            }
        });

        it('fails to initialize when credentials object is missing', function (done) {
            const WatsonClassifier = require('../lib/WatsonClassifier');
            try {
                new WatsonClassifier('abc12345', undefined);
                return done('should have failed');
            } catch (e) {
                expect(e).toBeA(TypeError);
                expect(e.message).toBe('credentials object must be defined');
                return done();
            }
        });

        it('fails to initialize when username attribute from the credentials object is missing', function (done) {
            const WatsonClassifier = require('../lib/WatsonClassifier');
            try {
                new WatsonClassifier('abc12345', {});
                return done('should have failed');
            } catch (e) {
                expect(e).toBeA(TypeError);
                expect(e.message).toBe('username attribute in the credentials object must be defined');
                return done();
            }
        });

        it('fails to initialize when password attribute from the credentials object is missing', function (done) {
            const WatsonClassifier = require('../lib/WatsonClassifier');
            try {
                new WatsonClassifier('abc12345', {username: 'abcdefg'});
                return done('should have failed');
            } catch (e) {
                expect(e).toBeA(TypeError);
                expect(e.message).toBe('password attribute in the credentials object must be defined');
                return done();
            }
        });

        it('initializes successfully with given valid values for classifierId and credentials', function (done) {
            const WatsonClassifier = require('../lib/WatsonClassifier');
            try {
                new WatsonClassifier('12345', {username: 'myusername', password: 'mypassword'});
                return done();
            } catch (e) {
                return done(e);
            }
        })
    });

    describe('getClassifications', function () {
        it('gets classifications for given text', function (done) {
            var mockWatsonLib = function (options) {
                var username = options.username;
                var password = options.password;

                this.classify = function MockClassifyFn(classificationOptions, callback) {
                    var text = classificationOptions.text;
                    var classifierId = classificationOptions.classifier_id;

                    return callback(undefined, {classes: [{class_name: 'hello', confidence: 0.999}]});
                };
            };

            mockery.registerMock(REQUIRE_WATSON_DEV_CLOUD_NLP_V1, mockWatsonLib);

            var WatsonClassifier = require('../lib/WatsonClassifier');
            var classifier = new WatsonClassifier(123, {username: 'mockUsername', password: 'mockPassword'});
            classifier.getClassifications('hello there', function (err, classifications) {
                expect(err).toNotExist();
                expect(classifications).toExist();
                expect(classifications.length).toBe(1);

                var classification = classifications[0];
                expect(classification.label).toBe('hello');
                expect(classification.value).toBe(0.999);

                return done();
            });
        });

        it('throws error in callback when watson cloud throws error in callback ignoring any extra response', function (done) {
            var mockWatsonLib = function (options) {
                var username = options.username;
                var password = options.password;

                this.classify = function MockClassifyFn(classificationOptions, callback) {
                    return callback(new Error('some error'), {some_response: true});
                };
            };

            mockery.registerMock(REQUIRE_WATSON_DEV_CLOUD_NLP_V1, mockWatsonLib);

            var WatsonClassifier = require('../lib/WatsonClassifier');
            var classifier = new WatsonClassifier(123, {username: 'mockUsername', password: 'mockPassword'});
            classifier.getClassifications('hello there', function (err, classifications) {
                expect(err).toExist();
                expect(err.message).toBe('some error');

                expect(classifications).toNotExist();
                return done();
            });
        });

        it('translates watson classes response to classification objects', function (done) {
            var mockWatsonLib = function (options) {
                var username = options.username;
                var password = options.password;

                this.classify = function MockClassifyFn(classificationOptions, callback) {
                    return callback(undefined, JSON.parse('{"classifier_id":"8aff06x106-nlc-11437","url":"https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/8aff06x106-nlc-11437","text":"i need help","top_class":"help","classes":[{"class_name":"help","confidence":0.994385165677839},{"class_name":"list_request","confidence":0.005614834322161013}]}'));
                };
            };

            mockery.registerMock(REQUIRE_WATSON_DEV_CLOUD_NLP_V1, mockWatsonLib);

            var WatsonClassifier = require('../lib/WatsonClassifier');
            var classifier = new WatsonClassifier(123, {username: 'mockUsername', password: 'mockPassword'});
            classifier.getClassifications('hello there', function (err, classifications) {
                expect(err).toNotExist();

                expect(classifications).toExist();
                expect(classifications.length).toBe(2);
                expect(classifications[0].label).toBe('help');
                expect(classifications[0].value).toBe(0.994385165677839);
                expect(classifications[1].label).toBe('list_request');
                expect(classifications[1].value).toBe(0.005614834322161013);

                return done();
            });
        });

    });

    describe('addDocument', function () {
        it('throws TypeError with unsupported error message when called', function(done) {
            const WatsonClassifier = require('../lib/WatsonClassifier');
            try {
                var classifier = new WatsonClassifier('classifierId', {username: 'myusername', password: 'supercomplicatedpassword'});
                classifier.addDocument();
                return done('should have failed');
            } catch (e) {
                expect(e).toExist();
                expect(e.message).toBe('Training Watson Classifier from this library is not yet supported.')

                return done();
            }
        });
    });

    describe('train', function () {
        it('throws TypeError with unsupported error message when called', function(done) {
            const WatsonClassifier = require('../lib/WatsonClassifier');
            try {
                var classifier = new WatsonClassifier('classifierId', {username: 'myusername', password: 'supercomplicatedpassword'});
                classifier.train();
                return done('should have failed');
            } catch (e) {
                expect(e).toExist();
                expect(e.message).toBe('Training Watson Classifier from this library is not yet supported.')

                return done();
            }
        });
    });
});