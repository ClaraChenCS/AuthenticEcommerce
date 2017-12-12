// spec/serverSpec.js

var request = require('request');
var base_url = "http://ie-shopper.elasticbeanstalk.com/";

describe("Handle routes request base url", function () {

    it("returns index.html rendered and must contain text:'API Documentation'", function(done) {
        request.get(base_url, function(error, response, body) {
            expect(body).toContain("USA");
            done();
        });
    });
});

describe("Handle main Post and Get routes", function () {

    it("returns the correct Post'", function(done) {
        request.get(base_url + 'login/', function(error, response, body) {
            expect(body).toContain("Login to your account");
            done();
        });
    });

    it("returns the correct Post", function(done) {
        request.get(base_url + '/', function(error, response, body) {
            expect(body).toContain("USA");
            done();
        });
    });
});