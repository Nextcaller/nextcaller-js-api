/* global define */
/* jshint browser: true */
/* jshint devel: true */

"use strict";

(function (window) {

    var base_url = "https://api.nextcaller.com/",
        sandbox_base_url = "https://api.sandbox.nextcaller.com/",
        default_api_version = "v2";

    function NextCallerClient(username, password, sandbox, version) {
        if (!(this instanceof NextCallerClient)) {
            return new NextCallerClient(username, password, sandbox, version);
        }
        this.username = username;
        this.password = password;
        this.base_url = (!!sandbox ?  sandbox_base_url : base_url) + 
            (version || default_api_version) + "/";
    }

    NextCallerClient.prototype.getByPhone = function(phone, success_callback, error_callback) {
        var url = this.base_url + "records/?format=json&phone=" + phone;
        makeCorsRequest("GET", url, this.username, this.password, success_callback, error_callback);
    };

    NextCallerClient.prototype.getByProfileId = function(profile_id, success_callback, error_callback) {
        var url = this.base_url + "users/" + profile_id + "/?format=json";
        makeCorsRequest("GET", url, this.username, this.password, success_callback, error_callback);
    };

    NextCallerClient.prototype.updateByProfileId = function(profile_id, data, success_callback, error_callback) {
        var json_data = JSON.stringify(data),
            url = this.base_url + "users/" + profile_id + "/?format=json";
        makeCorsRequest("POST", url, this.username, this.password, success_callback, error_callback, json_data);
    };

    function NextCallerPlatformClient(username, password, sandbox, version) {
        if (!(this instanceof NextCallerPlatformClient)) {
            return new NextCallerPlatformClient(username, password, sandbox, version);
        }
        this.username = username;
        this.password = password;
        this.base_url = (!!sandbox ?  sandbox_base_url : base_url) + 
            (version || default_api_version) + "/";
    }

    NextCallerPlatformClient.prototype.getByPhone = function(phone, platform_username, success_callback, error_callback) {
        var url = this.base_url + "records/?format=json&phone=" + phone + 
            "&platform_username=" + platform_username;
        makeCorsRequest("GET", url, this.username, this.password, success_callback, error_callback);
    };

    NextCallerPlatformClient.prototype.getByProfileId = function(profile_id, platform_username, success_callback, error_callback) {
        var url = this.base_url + "users/" + profile_id + "/?format=json" +
            "&platform_username=" + platform_username;
        makeCorsRequest("GET", url, this.username, this.password, success_callback, error_callback);
    };

    NextCallerPlatformClient.prototype.updateByProfileId = function(profile_id, data, platform_username, success_callback, error_callback) {
        var json_data = JSON.stringify(data),
            url = this.base_url + "users/" + profile_id + "/?format=json" + 
                "&platform_username=" + platform_username;
        makeCorsRequest("POST", url, this.username, this.password, success_callback, error_callback, json_data);
    };

    NextCallerPlatformClient.prototype.getPlatformStatistics = function(platform_username, success_callback, error_callback) {
        var url = this.base_url + "platform_users/" + (platform_username ? platform_username + "/" : "") + "?format=json";
        makeCorsRequest("GET", url, this.username, this.password, success_callback, error_callback);
    }

    NextCallerPlatformClient.prototype.updatePlatformUser = function(platform_username, data, success_callback, error_callback) {
        var json_data = JSON.stringify(data),
            url = this.base_url + "platform_users/" + platform_username + "/?format=json";
        makeCorsRequest("POST", url, this.username, this.password, success_callback, error_callback, json_data);
    }

    NextCallerClient.prototype.getFraudLevel = NextCallerPlatformClient.prototype.getFraudLevel = function(phone, success_callback, error_callback) {
        var url = this.base_url + "fraud/?format=json&phone=" + phone;
        makeCorsRequest("GET", url, this.username, this.password, success_callback, error_callback);
    };

    var error_handler = function (err, status_code, error_callback) {
        var json_message = err.message || err;
        try {
            json_message = JSON.parse(json_message);
        } catch (error) {}
        if (typeof(error_callback) === "function") {
            error_callback(json_message, status_code);
        } else {
            console.log(json_message);
        }
    };

    var success_handler = function (data, status_code, success_callback) {
        var json_message = data;
        try {
            json_message = JSON.parse(data);
        } catch (error) {}
        if (typeof(success_callback) === "function") {
            success_callback(json_message, status_code);
        } else {
            console.log(json_message);
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
    function makeCorsRequest(method, url, username, password, success_callback, error_callback, data) {
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
                status_code = xhr.status;
            if (status_code >= 400) {
                error_handler(text, status_code, error_callback);
            } else {
                success_handler(text, status_code, success_callback);
            }
        };

        xhr.onerror = function() {
            var text = xhr.responseText,
                status_code = xhr.status;
            error_handler(text, status_code, error_callback);
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

