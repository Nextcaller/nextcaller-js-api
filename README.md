nextcaller-js-api
=====================

[![Build Status](https://travis-ci.org/Nextcaller/nextcaller-js-api.svg?branch=master)](https://travis-ci.org/Nextcaller/nextcaller-js-api)

A JS wrapper around the Nextcaller API using CORS.

Requirements
------------

    * Chrome 3+
    * Firefox 3.5+
    * Opera 12+
    * Safari 4+
    * Internet Explorer 10+

Installation
------------

see example/cors\_phone\_example.html

    
    <script data-main="PATH_TO/nextcaller" src="PATH_TO/lib/require.js"></script>

or


    <script src="PATH_TO/nextcaller.js"></script>


Example
-------

    var api_key = "XXXXX",
        api_secret = "XXXXX",
        phone_number = "121212...",
        client = module.NextcallerClient(api_key, api_secret);
    client.getPhone(phone_number, function (data, status_code) {
        console.log(data);
        console.log(status_code);
    }, function (error, status_code) {
        console.log(error);
        console.log(status_code);
    });


Client
-------------

    var api_key = "XXXXX",
        api_secret = "XXXXX",
        client = NextcallerClient(api_key, api_secret);

    Parameters:

    api_key - api key
    api_secret - api secret


API Items
-------------

### Get profile by phone ###

    client.getPhone(number, success_callback, error_callback)
    
    Parameters:
    
    number - phone number
    success_callback - function called on a success result
    function success_callback(data, status_code) {
        console.log(data);
        console.log(status_code);
    }
    error_callback - function called on an error
    function error_callback(error, status_code) {
        console.log(error);
        console.log(status_code);
    }

### Get profile by id ###

    client.getProfile(profile_id, success_callback, error_callback)
    
    Parameters:
    
    profile_id - id of a profile
    success_callback - function called on a success result
    function success_callback(data, status_code) {
        console.log(data);
        console.log(status_code);
    }
    error_callback - function called on an error
    function error_callback(error, status_code) {
        console.log(error);
        console.log(status_code);
    }

### Update profile ###

    client.updateProfile(profile_id, data, success_callback, error_callback)
    
    Parameters:
    
    profile_id - id of a profile
    data - data to update
    success_callback - function called on a success result
    function success_callback(data, status_code) {
        console.log(data);
        console.log(status_code);
    }
    error_callback - function called on an error
    function error_callback(error, status_code) {
        console.log(error);
        console.log(status_code);
    }

    Example:
    profile_id = "XXXXXXXXX" 
    data = {
        "email": "test@test.com"
    }
    function success_callback(data, status_code) {
        console.log("Response data: ", data);
        console.log("Status code: ",status_code);
    }
    function error_callback(error, status_code) {
        console.log("Error: ", error);
        console.log("Status code: ",status_code);
    }
    client.updateProfile(profile_id, data, success_callback, error_callback);
