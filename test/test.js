/* global describe */
/* global it */
/* global NextcallerClient */
/* jshint node:true */
/* jshint unused:false */

"use strict";

var before = window.before,
    sinon = window.sinon,
    after = window.after,
    phone = 2125558383,
    wrong_phone = 212555838,
    profile_id = "97d949a413f4ea8b85e9586e1f2d9a",
    wrong_profile_id = profile_id + "XXXXXXXXXXX",
    api_key = "XXXXXXXXXXXXX",
    api_secret = "YYYYYYYYYYYYYYY",
    phone_response_object = {
        "records": [
            {
                "id": "97d949a413f4ea8b85e9586e1f2d9a",
                "first_name": "Jerry",
                "last_name": "Seinfeld",
                "name": "Jerry Seinfeld",
                "language": "English",
                "fraud_threat": "low",
                "spoof": "false",
                "phone": [
                    {
                        "number": "2125558383"
                    }
                ],
                "carrier": "Verizon Wireless",
                "line_type": "LAN",
                "address": [
                    {
                        "city": "New York",
                        "extended_zip": "",
                        "country": "USA",
                        "line2": "Apt 5a",
                        "line1": "129 West 81st Street",
                        "state": "NY",
                        "zip_code": "10024"
                    }
                ],
                "email": "demo@nextcaller.com",
                "age": "45-54",
                "gender": "Male",
                "household_income": "50k-75k",
                "marital_status": "Single",
                "presence_of_children": "No",
                "home_owner_status": "Rent",
                "market_value": "350k-500k",
                "length_of_residence": "12 Years",
                "high_net_worth": "No",
                "occupation": "Entertainer",
                "education": "Completed College",
                "department": "not specified"
            }
        ]
    }, profile_response_object = {
        "id": "97d949a413f4ea8b85e9586e1f2d9a",
        "first_name": "Jerry",
        "last_name": "Seinfeld",
        "name": "Jerry Seinfeld",
        "language": "English",
        "fraud_threat": "low",
        "spoof": "false",
        "phone": [
            {
                "number": "2125558383"
            }
        ],
        "carrier": "Verizon Wireless",
        "line_type": "LAN",
        "address": [
            {
                "city": "New York",
                "extended_zip": "",
                "country": "USA",
                "line2": "Apt 5a",
                "line1": "129 West 81st Street",
                "state": "NY",
                "zip_code": "10024"
            }
        ],
        "email": "demo@nextcaller.com",
        "age": "45-54",
        "gender": "Male",
        "household_income": "50k-75k",
        "marital_status": "Single",
        "presence_of_children": "No",
        "home_owner_status": "Rent",
        "market_value": "350k-500k",
        "length_of_residence": "12 Years",
        "high_net_worth": "No",
        "occupation": "Entertainer",
        "education": "Completed College",
        "department": "not specified"
    }, profile_request_object = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "test@test.com",
        "shipping_address1": {
            "line1": "225 Kryptonite Ave.",
            "line2": "",
            "city": "Smallville",
            "state": "KS",
            "zip_code": "66002"
        }
    }, wrong_phone_error = {
        "error": {
            "message": "The number you have entered is invalid. Please ensure your number contains 10 digits.",
            "code": "555",
            "type": "Bad Request"
        }
    }, client = new NextCallerClient(api_key, api_secret);

describe("getPhone with correct phone number", function () {

    var xhr, requests;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the correct response", function (done) {
        var phone_response_object_str = JSON.stringify(phone_response_object);
        client.getPhone(phone, function (data, status_code) {
            status_code.should.equal(200);
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profile_id);
            done();
        });
        requests[0].respond(200, {}, phone_response_object_str);
    });
});


describe("getPhone with incorrect phone number", function () {
    
    var xhr, requests;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return 400 error", function (done) {
        var phone_error_object_str = JSON.stringify(wrong_phone_error);
        client.getPhone(wrong_phone, null, function (data, status_code) {
            status_code.should.equal(400);
            data.error.code.should.equal("555");
            done();
        });
        requests[0].respond(400, {}, phone_error_object_str);
    });
});


describe("getProfile with correct profile id", function () {

    var xhr, requests;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the correct response", function (done) {
        var profile_response_object_str = JSON.stringify(profile_response_object);
        client.getProfile(profile_id, function (data, status_code) {
            status_code.should.equal(200);
            data.phone[0].number.should.equal(phone.toString());
            data.id.should.equal(profile_id);
            done();
        });
        requests[0].respond(200, {}, profile_response_object_str);
    });
});


describe("getProfile with incorrect profile id", function () {

    var xhr, requests;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return 404 response", function (done) {
        client.getProfile(wrong_profile_id, null, function (error, status_code) {
            status_code.should.equal(404);
            error.should.equal("");
            done();
        });
        requests[0].respond(404, {}, "");
    });
});


describe("updateProfile with correct profile id", function () {

    var xhr, requests;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the correct response", function (done) {
        client.updateProfile(profile_id, profile_request_object, function (data, status_code) {
            status_code.should.equal(204);
            data.should.equal("");
            done();
        });
        requests[0].respond(204, {}, "");
    });
});


describe("updateProfile with incorrect profile id", function () {

    var xhr, requests;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return 404 response", function (done) {
        client.updateProfile(wrong_profile_id, profile_request_object, null, function (error, status_code) {
            status_code.should.equal(404);
            error.should.equal("");
            done();
        });
        requests[0].respond(404, {}, "");
    });
});


describe("updateProfile with incorrect email", function () {

    var xhr, requests;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return 400 response", function (done) {
        var update_profile_request_object = {
            "email": "OOOPS"
        }, update_profile_response = {
            "users": {
                "email": "Bad Request: Invalid email address"
            }
        };
        client.updateProfile(profile_id, update_profile_request_object, null, function (error, status_code) {
            status_code.should.equal(400);
            error.users.email.should.equal(update_profile_response.users.email);
            done();
        });
        requests[0].respond(400, {}, JSON.stringify(update_profile_response));
    });
});
