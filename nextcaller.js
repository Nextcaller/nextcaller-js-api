/* global define */
/* jshint browser: true */
/* jshint devel: true */

"use strict";

(function (window) {

    var base_url = "https://api.nextcaller.com/v2/";

    function Client(api_key, api_secret) {
        if (!(this instanceof Client)) {
            return new Client(api_key, api_secret);
        }
        this.api_key = api_key;
        this.api_secret = api_secret;
    }

    Client.prototype.getPhone = function(phone, success_callback, error_callback) {
        var url = base_url + "records/?format=json&phone=" + phone;
        makeCorsRequest("GET", url, this.api_key, this.api_secret, success_callback, error_callback);
    };

    Client.prototype.getProfile = function(profile_id, success_callback, error_callback) {
        var url = base_url + "users/" + profile_id + "/?format=json";
        makeCorsRequest("GET", url, this.api_key, this.api_secret, success_callback, error_callback);
    };

    Client.prototype.updateProfile = function(profile_id, data, success_callback, error_callback) {
        var json_data = JSON.stringify(data),
            url = base_url + "users/" + profile_id + "/?format=json";
        makeCorsRequest("POST", url, this.api_key, this.api_secret, success_callback, error_callback, json_data);
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

    window.NextcallerClient = Client;

    if (typeof(define) === "function") {
        define(function (require, exports) {
            exports.NextcallerClient = Client;
        });
    }

}(window));

