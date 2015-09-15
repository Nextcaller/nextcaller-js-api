/* global define */
/* jshint browser: true */
/* jshint devel: true */

"use strict";

(function (window) {

    var baseUrl = "https://api.nextcaller.com/",
        sandboxBaseUrl = "https://api.sandbox.nextcaller.com/",
        defaultApiVersion = "v2.1",
        defaultPlatformAccountHeader = "Nc-Account-Id";

    function serialize(obj) {
        var vals = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                vals.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
            }
        }
        return "?" + vals.join("&");
    }

    function NextCallerClient(username, password, sandbox) {
        if (!(this instanceof NextCallerClient)) {
            return new NextCallerClient(username, password, sandbox);
        }
        this.username = username;
        this.password = password;
        this.baseUrl = (!!sandbox ?  sandboxBaseUrl : baseUrl) + defaultApiVersion + "/";
    }

    NextCallerClient.prototype.getByPhone = function(phone, successCallback, errorCallback) {
        var params = {
            "format": "json",
            "phone": phone    
        }, url = this.baseUrl + "records/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerClient.prototype.getByNameAddress = function(nameAddressData, successCallback, errorCallback) {
        nameAddressData.format = "json";
        var url = this.baseUrl + "records/" + serialize(nameAddressData);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerClient.prototype.getByEmail = function(email, successCallback, errorCallback) {
        var params = {
            "email": email,
            "format": "json"
        }, url = this.baseUrl + "records/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerClient.prototype.getByProfileId = function(profileId, successCallback, errorCallback) {
        var url = this.baseUrl + "users/" + profileId + "/" + serialize({"format": "json"});
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerClient.prototype.updateByProfileId = function(profileId, data, successCallback, errorCallback) {
        var jsonData = JSON.stringify(data),
            url = this.baseUrl + "users/" + profileId + "/" + serialize({"format": "json"});
        makeCorsRequest("POST", url, this.username, this.password, successCallback, errorCallback, jsonData);
    };

    NextCallerClient.prototype.getFraudLevel = function(phone, successCallback, errorCallback) {
        var params = {
            "format": "json",
            "phone": phone    
        }, url = this.baseUrl + "fraud/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    function NextCallerPlatformClient(username, password, sandbox) {
        if (!(this instanceof NextCallerPlatformClient)) {
            return new NextCallerPlatformClient(username, password, sandbox);
        }
        this.username = username;
        this.password = password;
        this.baseUrl = (!!sandbox ?  sandboxBaseUrl : baseUrl) + defaultApiVersion + "/";
    }

    NextCallerPlatformClient.prototype.getByPhone = function(phone, accountId, successCallback, errorCallback) {
        var params = {
            "format": "json",
            "phone": phone
        },url = this.baseUrl + "records/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback, null, accountId);
    };

    NextCallerPlatformClient.prototype.getByNameAddress = function(nameAddressData, accountId, successCallback, errorCallback) {
        nameAddressData.format = "json";
        var url = this.baseUrl + "records/" + serialize(nameAddressData);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback, null, accountId);
    };

    NextCallerPlatformClient.prototype.getByEmail = function(email, accountId, successCallback, errorCallback) {
        var params = {
            "email": email,
            "format": "json"
        },url = this.baseUrl + "records/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback, null, accountId);
    };

    NextCallerPlatformClient.prototype.getByProfileId = function(profileId, accountId, successCallback, errorCallback) {
        var params = {
            "format": "json"
        }, url = this.baseUrl + "users/" + profileId + "/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback, null, accountId);
    };

    NextCallerPlatformClient.prototype.updateByProfileId = function(profileId, data, accountId, successCallback, errorCallback) {
        var jsonData = JSON.stringify(data),
            params = {
                "format": "json"
            }, url = this.baseUrl + "users/" + profileId + "/" + serialize(params);
        makeCorsRequest("POST", url, this.username, this.password, successCallback, errorCallback, jsonData, accountId);
    };

    NextCallerPlatformClient.prototype.getPlatformStatistics = function(page, successCallback, errorCallback) {
        if (!page) {page = 1;}
        var params = {
            "format": "json",
            "page": page
        }, url = this.baseUrl + "accounts/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerPlatformClient.prototype.getPlatformAccount = function(accountId, successCallback, errorCallback) {
        var url = this.baseUrl + "accounts/" + accountId + "/" + serialize({"format": "json"});
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerPlatformClient.prototype.createPlatformAccount = function(data, successCallback, errorCallback) {
        var jsonData = JSON.stringify(data),
            url = this.baseUrl + "accounts/" + serialize({"format": "json"});
        makeCorsRequest("POST", url, this.username, this.password, successCallback, errorCallback, jsonData);
    };

    NextCallerPlatformClient.prototype.updatePlatformAccount = function(data, accountId, successCallback, errorCallback) {
        var jsonData = JSON.stringify(data),
            url = this.baseUrl + "accounts/" + accountId + "/" + serialize({"format": "json"});
        makeCorsRequest("PUT", url, this.username, this.password, successCallback, errorCallback, jsonData);
    };

    NextCallerPlatformClient.prototype.getFraudLevel = function(phone, accountId, successCallback, errorCallback) {
        var params = {
            "format": "json",
            "phone": phone
        }, url = this.baseUrl + "fraud/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback, null, accountId);
    };

    var errorHandler = function (err, statusCode, errorCallback) {
        var jsonMessage = err.message || err;
        try {
            jsonMessage = JSON.parse(jsonMessage);
        } catch (error) {}
        if (typeof(errorCallback) === "function") {
            errorCallback(jsonMessage, statusCode);
        } else {
            console.log(jsonMessage);
        }
    };

    var successHandler = function (data, statusCode, successCallback) {
        var jsonMessage = data;
        try {
            jsonMessage = JSON.parse(data);
        } catch (error) {}
        if (typeof(successCallback) === "function") {
            successCallback(jsonMessage, statusCode);
        } else {
            console.log(jsonMessage);
        }
    };

    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.withCredentials = true;
            xhr.open(method, url, true);
        } else {
            // CORS with credentials is not supported.
            xhr = null;
        }
        return xhr;
    }

    // Make the actual CORS request.
    function makeCorsRequest(method, url, username, password, successCallback, errorCallback, data, accountId) {
        // All HTML5 Rocks properties support CORS.
        method = method.toUpperCase();
        var xhr = createCORSRequest(method, url);
        if (!xhr) {
            throw Error("CORS not supported");
        }
        
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        if (accountId) {
            xhr.setRequestHeader(defaultPlatformAccountHeader, accountId);
        }
        if (data && method !== "GET") {
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        }

        // Response handlers.
        xhr.onload = function() {
            var text = xhr.responseText,
                statusCode = xhr.status;
            if (statusCode >= 400) {
                errorHandler(text, statusCode, errorCallback);
            } else {
                successHandler(text, statusCode, successCallback);
            }
        };

        xhr.onerror = function() {
            var text = xhr.responseText,
                statusCode = xhr.status;
            errorHandler(text, statusCode, errorCallback);
        };
        if (data && method !== "GET") {
            xhr.send(data);
        } else {
            xhr.send();
        }
    }

    window.NextCallerClient = NextCallerClient;
    window.NextCallerPlatformClient = NextCallerPlatformClient;

    if (typeof(define) === "function") {
        define(function (require, exports) {
            exports.NextCallerClient = NextCallerClient;
            exports.NextCallerPlatformClient = NextCallerPlatformClient;
        });
    }

}(window));

