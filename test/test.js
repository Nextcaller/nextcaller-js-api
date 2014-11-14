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
    username = "XXXXXXXXXXXXX",
    password = "YYYYYYYYYYYYYYY",
    default_api_version = "v2",
    client = new window.NextCallerClient(username, password, true, default_api_version),
    platform_client = new window.NextCallerPlatformClient(username, password, true, default_api_version),
    platform_username = "test",
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
    }, 
    platform_statistics_response_object = {
        "object_list": [
            {
                "username": "test",
                "first_name": "",
                "last_name": "",
                "company_name": "",
                "email": "",
                "number_of_operations": 3,
                "successful_calls": {
                    "201411": 3
                },
                "total_calls": {
                    "201411": 3
                },
                "created_time": "2014-11-13 06:07:19.836404",
                "resource_uri": "/v2/platform_users/test/"
            }
        ],
       "page": 1,
        "has_next": false,
        "total_pages": 1,
        "total_platform_calls": {
            "2014-11": 3
        },
        "successful_platform_calls": {
            "2014-11": 3
        }
    },
    platform_statistics_by_user_response_object = {
        "username": "test",
        "first_name": "",
        "last_name": "",
        "company_name": "",
        "email": "",
        "number_of_operations": 3,
        "successful_calls": {
            "201411": 3
        },
        "total_calls": {
            "201411": 3
        },
        "resource_uri": "/v2/platform_users/test/"
    },
    platform_update_user_json_request_example = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "test@test.com"
    },
    platform_update_user_wrong_json_request_example = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "XXXX"
    },
    platform_update_user_wrong_result = {
        "error": {
            "message": "Validation Error",
            "code": "422",
            "type": "Unprocessable Entity",
            "description": {
                "email": [
                    "Enter a valid email address."
                ]
            }
        }
    };


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
        client.getByPhone(phone, function (data, status_code) {
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
        client.getByPhone(wrong_phone, null, function (data, status_code) {
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
        client.getByProfileId(profile_id, function (data, status_code) {
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
        client.getByProfileId(wrong_profile_id, null, function (error, status_code) {
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
        client.updateByProfileId(profile_id, profile_request_object, function (data, status_code) {
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
        client.updateByProfileId(wrong_profile_id, profile_request_object, null, function (error, status_code) {
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
        client.updateByProfileId(profile_id, update_profile_request_object, null, function (error, status_code) {
            status_code.should.equal(400);
            error.users.email.should.equal(update_profile_response.users.email);
            done();
        });
        requests[0].respond(400, {}, JSON.stringify(update_profile_response));
    });
});

describe("platformClient getPhone with correct phone number", function () {

    var xhr,
        requests,
        platform_statistics_response_object_str = JSON.stringify(platform_statistics_response_object);

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the correct response", function (done) {
        platform_client.getPlatformStatistics(null, function (data, status_code) {
            status_code.should.equal(200);
            data.object_list[0].username.should.equal(platform_username);
            data.object_list[0].number_of_operations.should.equal(3);
            done();
        });
        requests[0].respond(200, {}, platform_statistics_response_object_str);
    });
});


describe("platformClient get platform statistics by user", function () {
    var xhr,
        requests,
        platform_statistics_by_user_response_object_str = JSON.stringify(platform_statistics_by_user_response_object);

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the correct response", function (done) {
        platform_client.getPlatformStatistics(platform_username, function (data, status_code) {
            status_code.should.equal(200);
            data.username.should.equal(platform_username);
            data.number_of_operations.should.equal(3);
            done();
        });
        requests[0].respond(200, {}, platform_statistics_by_user_response_object_str);
    });

});


describe("platformClient update platform user with incorrect data", function () {

    var xhr,
        requests,
        platform_update_user_wrong_result_str = JSON.stringify(platform_update_user_wrong_result);

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the 400 response", function (done) {
        platform_client.updatePlatformUser(platform_username, platform_update_user_wrong_json_request_example, null, function (data, status_code) {
            status_code.should.equal(400);
            data.error.description.email[0].should.equal("Enter a valid email address.");
            done();
        });
        requests[0].respond(400, {}, platform_update_user_wrong_result_str);
    });

});

describe("platformClient update platform user with correct data", function () {

    var xhr, requests;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the 204 correct response", function (done) {
        platform_client.updatePlatformUser(platform_username, platform_update_user_wrong_json_request_example, function (data, status_code) {
            status_code.should.equal(204);
            data.should.equal("");
            done();
        });
        requests[0].respond(204, {}, "");
    });

});