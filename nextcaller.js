/* global define */
/* jshint browser: true */
/* jshint devel: true */

"use strict";

(function (window) {

    var baseUrl = "https://api.nextcaller.com/",
        sandboxBaseUrl = "https://api.sandbox.nextcaller.com/",
        defaultApiVersion = "v2";

    function serialize(obj) {
        var vals = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                vals.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
            }
        }
        return "?" + vals.join("&");
    }

    function NextCallerClient(username, password, sandbox, version) {
        if (!(this instanceof NextCallerClient)) {
            return new NextCallerClient(username, password, sandbox, version);
        }
        this.username = username;
        this.password = password;
        this.baseUrl = (!!sandbox ?  sandboxBaseUrl : baseUrl) + 
            (version || defaultApiVersion) + "/";
    }

    NextCallerClient.prototype.getByPhone = function(phone, successCallback, errorCallback) {
        var params = {
            "format": "json",
            "phone": phone    
        }, url = this.baseUrl + "records/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerClient.prototype.getByAddressName = function(addressData, successCallback, errorCallback) {
        addressData.format = "json";
        var url = this.baseUrl + "records/" + serialize(addressData);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerClient.prototype.getByProfileId = function(profile_id, successCallback, errorCallback) {
        var url = this.baseUrl + "users/" + profile_id + "/" + serialize({"format": "json"});
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerClient.prototype.updateByProfileId = function(profile_id, data, successCallback, errorCallback) {
        var jsonData = JSON.stringify(data),
            url = this.baseUrl + "users/" + profile_id + "/" + serialize({"format": "json"});
        makeCorsRequest("POST", url, this.username, this.password, successCallback, errorCallback, jsonData);
    };

    NextCallerClient.prototype.getFraudLevel = function(phone, successCallback, errorCallback) {
        var params = {
            "format": "json",
            "phone": phone    
        }, url = this.baseUrl + "fraud/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    function NextCallerPlatformClient(username, password, sandbox, version) {
        if (!(this instanceof NextCallerPlatformClient)) {
            return new NextCallerPlatformClient(username, password, sandbox, version);
        }
        this.username = username;
        this.password = password;
        this.baseUrl = (!!sandbox ?  sandboxBaseUrl : baseUrl) + 
            (version || defaultApiVersion) + "/";
    }

    NextCallerPlatformClient.prototype.getByPhone = function(phone, platformUsername, successCallback, errorCallback) {
        var params = {
            "format": "json",
            "phone": phone,
            "platform_username": platformUsername    
        }, url = this.baseUrl + "records/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerPlatformClient.prototype.getByAddressName = function(addressData, platformUsername, successCallback, errorCallback) {
        addressData.format = "json";
        addressData.platform_username = platformUsername;
        var url = this.baseUrl + "records/" + serialize(addressData);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerPlatformClient.prototype.getByProfileId = function(profile_id, platformUsername, successCallback, errorCallback) {
        var params = {
            "format": "json",
            "platform_username": platformUsername    
        }, url = this.baseUrl + "users/" + profile_id + "/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerPlatformClient.prototype.updateByProfileId = function(profile_id, data, platformUsername, successCallback, errorCallback) {
        var jsonData = JSON.stringify(data),
            params = {
                "format": "json",
                "platform_username": platformUsername    
            }, url = this.baseUrl + "users/" + profile_id + "/" + serialize(params);
        makeCorsRequest("POST", url, this.username, this.password, successCallback, errorCallback, jsonData);
    };

    NextCallerPlatformClient.prototype.getPlatformStatistics = function(page, successCallback, errorCallback) {
        if (!page) {page = 1;}
        var params = {
            "format": "json",
            "page": page
        }, url = this.baseUrl + "platform_users/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerPlatformClient.prototype.getPlatformUser = function(platformUsername, successCallback, errorCallback) {
        var url = this.baseUrl + "platform_users/" + platformUsername + "/" + serialize({"format": "json"});
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
    };

    NextCallerPlatformClient.prototype.updatePlatformUser = function(platformUsername, data, successCallback, errorCallback) {
        var jsonData = JSON.stringify(data),
            url = this.baseUrl + "platform_users/" + platformUsername + "/" + serialize({"format": "json"});
        makeCorsRequest("POST", url, this.username, this.password, successCallback, errorCallback, jsonData);
    };

    NextCallerPlatformClient.prototype.getFraudLevel = function(phone, platformUsername, successCallback, errorCallback) {
        var params = {
            "format": "json",
            "phone": phone,
            "platform_username": platformUsername    
        }, url = this.baseUrl + "fraud/" + serialize(params);
        makeCorsRequest("GET", url, this.username, this.password, successCallback, errorCallback);
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
    function makeCorsRequest(method, url, username, password, successCallback, errorCallback, data) {
        // All HTML5 Rocks properties support CORS.
        method = method.toUpperCase();
        var xhr = createCORSRequest(method, url);
        if (!xhr) {
            throw Error("CORS not supported");
        }
        
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        
        if (data && method === "POST") {
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
        if (data && method === "POST") {
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

