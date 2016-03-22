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
    wrongPhone = 212555838,
    profileId = "97d949a413f4ea8b85e9586e1f2d9a",
    wrongProfileId = profileId + "XXXXXXXXXXX",
    email = "demo@nextcaller.com",
    wrongEmail = "demo@nextcaller@com",
    username = "XXXXXXXXXXXXX",
    password = "YYYYYYYYYYYYYYY",
    client = new window.NextCallerClient(username, password, true),
    platformClient = new window.NextCallerPlatformClient(username, password, true),
    accountId = "test",
    phoneResponseObject = {
        "records": [
            {
                "id": "97d949a413f4ea8b85e9586e1f2d9a",
                "first_name": "Jerry",
                "last_name": "Seinfeld",
                "name": "Jerry Seinfeld",
                "language": "English",
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
    }, profileResponseObject = {
        "id": "97d949a413f4ea8b85e9586e1f2d9a",
        "first_name": "Jerry",
        "last_name": "Seinfeld",
        "name": "Jerry Seinfeld",
        "language": "English",
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
    }, profileRequestObject = {
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
    }, wrongPhoneError = {
        "error": {
            "message": "The number you have entered is invalid. Please ensure your number contains 10 digits.",
            "code": "555",
            "type": "Bad Request"
        }
    }, wrongEmailError = {
        "error": {
            "message": "The email address you have entered is invalid.",
            "code": "560",
            "type": "Bad Request"
        }
    }, platformStatisticsResponseObject = {
        "object_list": [
            {
                "id": "test",
                "first_name": "",
                "last_name": "",
                "company_name": "",
                "email": "",
                "number_of_operations": 3,
                "billed_operations": {
                    "2014-11": 3
                },
                "total_operations": {
                    "2014-11": 3
                },
                "object": "account",
                "resource_uri": "/v2/accounts/test/"
            }
        ],
        "page": 1,
        "has_next": false,
        "total_pages": 1,
        "object": "page",
        "total_platform_operations": {
            "2014-11": 3
        },
        "billed_platform_operations": {
            "2014-11": 3
        }
    },
    platformStatisticsByAccountResponseObject = {
        "id": "test",
        "first_name": "",
        "last_name": "",
        "company_name": "",
        "email": "",
        "number_of_operations": 3,
        "billed_operations": {
            "2014-11": 3
        },
        "total_operations": {
            "2014-11": 3
        },
        "object": "account",
        "resource_uri": "/v2/accounts/test/"
    },
    platformCreateAccountJsonRequestExample = {
        "id": "test_username",
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "test@test.com"
    },
    platformCreateAccountWrongJsonRequestExample = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "test@test.com"
    },
    platformCreateAccountWrongResult = {
        "error": {
            "message": "Validation Error",
            "code": "422",
            "type": "Unprocessable Entity",
            "description": {
                "id": [
                    "This field cannot be blank."
                ]
            }
        }
    },
    platformUpdateAccountJsonRequestExample = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "test@test.com"
    },
    platformUpdateAccountWrongJsonRequestExample = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "XXXX"
    },
    platformUpdateAccountWrongResult = {
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
    },
    wrongNameAddressResponseObj = {
        "error": {
            "message": "Validation Error",
            "code": "422",
            "type": "Unprocessable Entity",
            "description": {
                "address": [
                    "zip_code or combination of city and state parameters must be provided."
                ]
            }
        }
    },
    wrongNameAddressRequestObj = {
        "first_name": "Sharon",
        "last_name": "Ehni",
        "address": "7160 Sw Crestview Pl"
    },
    correctNameAddressRequestObj = {
        "first_name": "Sharon",
        "last_name": "Ehni",
        "address": "7160 Sw Crestview Pl",
        "zip_code": 97008
    };



describe("getByPhone with correct phone number", function () {

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
        var phoneResponseObjectStr = JSON.stringify(phoneResponseObject);
        client.getByPhone(phone, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profileId);
            done();
        });
        requests[0].respond(200, {}, phoneResponseObjectStr);
    });
});


describe("getByPhone with incorrect phone number", function () {
    
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
        var phoneErrorObjectStr = JSON.stringify(wrongPhoneError);
        client.getByPhone(wrongPhone, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.code.should.equal("555");
            done();
        });
        requests[0].respond(400, {}, phoneErrorObjectStr);
    });
});


describe("getByNameAddress with correct name and address data", function () {

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
        var nameAddressResponseObjectStr = JSON.stringify(phoneResponseObject);
        client.getByNameAddress(correctNameAddressRequestObj, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profileId);
            done();
        });
        requests[0].respond(200, {}, nameAddressResponseObjectStr);
    });
});


describe("getByNameAddress with incorrect name and address data", function () {

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
        var nameAddressResponseObjectStr = JSON.stringify(wrongNameAddressResponseObj);
        client.getByNameAddress(wrongNameAddressRequestObj, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.code.should.equal("422");
            done();
        });
        requests[0].respond(400, {}, nameAddressResponseObjectStr);
    });
});


describe("getByProfileId with correct profile id", function () {

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
        var profileResponseObject_str = JSON.stringify(profileResponseObject);
        client.getByProfileId(profileId, function (data, statusCode) {
            statusCode.should.equal(200);
            data.phone[0].number.should.equal(phone.toString());
            data.id.should.equal(profileId);
            done();
        });
        requests[0].respond(200, {}, profileResponseObject_str);
    });
});


describe("getByProfileId with incorrect profile id", function () {

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
        client.getByProfileId(wrongProfileId, null, function (error, statusCode) {
            statusCode.should.equal(404);
            error.should.equal("");
            done();
        });
        requests[0].respond(404, {}, "");
    });
});


describe("getByEmail with correct email", function () {

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
        var emailResponseObjectStr = JSON.stringify(phoneResponseObject);
        client.getByEmail(email, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].email.should.equal(email);
            data.records[0].id.should.equal(profileId);
            done();
        });
        requests[0].respond(200, {}, emailResponseObjectStr);
    });
});


describe("getByEmail with incorrect email", function () {

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
        var emailErrorObjectStr = JSON.stringify(wrongEmailError);
        client.getByEmail(wrongEmail, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.code.should.equal("560");
            done();
        });
        requests[0].respond(400, {}, emailErrorObjectStr);
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
        client.updateByProfileId(profileId, profileRequestObject, function (data, statusCode) {
            statusCode.should.equal(204);
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
        client.updateByProfileId(wrongProfileId, profileRequestObject, null, function (error, statusCode) {
            statusCode.should.equal(404);
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
        var updateProfilerequestobject = {
            "email": "OOOPS"
        }, updateProfileResponse = {
            "users": {
                "email": "Bad Request: Invalid email address"
            }
        };
        client.updateByProfileId(profileId, updateProfilerequestobject, null, function (error, statusCode) {
            statusCode.should.equal(400);
            error.users.email.should.equal(updateProfileResponse.users.email);
            done();
        });
        requests[0].respond(400, {}, JSON.stringify(updateProfileResponse));
    });
});

describe("platformClient get platform statistics", function () {

    var xhr,
        requests,
        platformStatisticsResponseObjectStr = JSON.stringify(platformStatisticsResponseObject);

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the correct response", function (done) {
        platformClient.getPlatformStatistics(1, function (data, statusCode) {
            statusCode.should.equal(200);
            data.object_list[0].id.should.equal(accountId);
            data.object_list[0].number_of_operations.should.equal(3);
            data.page.should.equal(1);
            done();
        });
        requests[0].respond(200, {}, platformStatisticsResponseObjectStr);
    });
});


describe("platformClient get platform statistics by account", function () {
    var xhr,
        requests,
        platformStatisticsByAccountResponseObjectStr = JSON.stringify(platformStatisticsByAccountResponseObject);

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the correct response", function (done) {
        platformClient.getPlatformAccount(accountId, function (data, statusCode) {
            statusCode.should.equal(200);
            data.id.should.equal(accountId);
            data.number_of_operations.should.equal(3);
            done();
        });
        requests[0].respond(200, {}, platformStatisticsByAccountResponseObjectStr);
    });

});

describe("platformClient create platform account with incorrect data", function () {

    var xhr,
        requests,
        platformCreateAccountWrongResultStr = JSON.stringify(platformCreateAccountWrongResult);

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the 400 response", function (done) {
        platformClient.createPlatformAccount(platformCreateAccountWrongJsonRequestExample, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.description.id[0].should.equal("This field cannot be blank.");
            done();
        });
        requests[0].respond(400, {}, platformCreateAccountWrongResultStr);
    });

});

describe("platformClient create platform account with correct data", function () {

    var xhr, requests;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the 201 correct response", function (done) {
        platformClient.createPlatformAccount(platformCreateAccountJsonRequestExample, function (data, statusCode) {
            statusCode.should.equal(201);
            data.should.equal("");
            done();
        });
        requests[0].respond(201, {}, "");
    });

});

describe("platformClient update platform account with incorrect data", function () {

    var xhr,
        requests,
        platformUpdateAccountWrongResultStr = JSON.stringify(platformUpdateAccountWrongResult);

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });

    after(function () {
        xhr.restore();
    });

    it("should return the 400 response", function (done) {
        platformClient.updatePlatformAccount(platformUpdateAccountWrongJsonRequestExample, accountId, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.description.email[0].should.equal("Enter a valid email address.");
            done();
        });
        requests[0].respond(400, {}, platformUpdateAccountWrongResultStr);
    });

});

describe("platformClient update platform account with correct data", function () {

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
        platformClient.updatePlatformAccount(platformUpdateAccountJsonRequestExample, accountId, function (data, statusCode) {
            statusCode.should.equal(204);
            data.should.equal("");
            done();
        });
        requests[0].respond(204, {}, "");
    });

});


describe("platformClient getByNameAddress with correct name and address data", function () {

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
        var nameAddressResponseObjectStr = JSON.stringify(phoneResponseObject);
        platformClient.getByNameAddress(correctNameAddressRequestObj, accountId, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profileId);
            done();
        });
        requests[0].respond(200, {}, nameAddressResponseObjectStr);
    });
});


describe("platformClient getByNameAddress with incorrect name and address data", function () {

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
        var nameAddressResponseObjectStr = JSON.stringify(wrongNameAddressResponseObj);
        platformClient.getByNameAddress(wrongNameAddressRequestObj, accountId, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.code.should.equal("422");
            done();
        });
        requests[0].respond(400, {}, nameAddressResponseObjectStr);
    });
});


describe("platformClient getByEmail with correct email", function () {

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
        var emailResponseObjectStr = JSON.stringify(phoneResponseObject);
        platformClient.getByEmail(email, accountId, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].email.should.equal(email);
            data.records[0].id.should.equal(profileId);
            done();
        });
        requests[0].respond(200, {}, emailResponseObjectStr);
    });
});


describe("platformClient getByEmail with incorrect email", function () {

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
        var emailErrorObjectStr = JSON.stringify(wrongEmailError);
        platformClient.getByEmail(wrongEmail, accountId, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.code.should.equal("560");
            done();
        });
        requests[0].respond(400, {}, emailErrorObjectStr);
    });
});
