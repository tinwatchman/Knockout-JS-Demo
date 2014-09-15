/*
 * jQuery Observer Pattern Plugin
 * @author Jon Stout (http://www.jonstout.net/)
 * @version 1.0
 * @copyright (c) 2014 Jon Stout (www.jonstout.net)
 * @description A very basic Observer Pattern/Publish-Subscribe framework for jQuery.
 * @license Licensed under the MIT License.
 */
 /*
    Copyright (c) 2014 Jon Stout

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
  */
;(function($, window, document, undefined) {

    ////////////////////////////////
    //PUBLISH-SUBSCRIBE FRAMEWORK //
    ////////////////////////////////

    /**
     * private map of subscriptions
     * @type {Object}
     */
    var subscriptionMap = {};

    // subscribe
    $.subscribe = function(type, context, method) {
        if (!subscriptionMap[type]) {
            subscriptionMap[type] = [];
        }
        subscriptionMap[type].push(new Observer(context, method));
    }

    /**
     * Subscribe Once
     *
     * Intended primarily for anonymous functions. Called once when the signal
     * is sent, then flushed from memory.
     *
     * @param  {String}   type    notification type to listen for
     * @param  {Function} handler anonymous function to call on signal
     * @return none
     */
    $.subscribeOnce = function(type, handler) {
        if (!subscriptionMap[type]) {
            subscriptionMap[type] = [];
        }
        var observer = new Observer(null, handler);
        observer.isOneTimeUse = true;
        subscriptionMap[type].push(observer);
    }

    /**
     * Unsubscribe
     * 
     * Remove an existing subscription.
     * 
     * @param  {string}   type    notification type
     * @param  {Function} method  handler method
     * @param  {Object}   context observing object
     * @return {none}
     */
    $.unsubscribe = function(type, context, method) {
        if (subscriptionMap[type]) {
            $.each(subscriptionMap[type], function(index, observer) {
                if (observer.context === context && (method === null || observer.method === method)) {
                    observer.destroy();
                    subscriptionMap[type].splice(index, 1);
                }
            });
        }
    }

    /**
     * Publish
     *
     * Send a message out to all interested entities.
     * 
     * @param  {string} type notification type
     * @param  {Object} data notification data to send
     * @return {none}
     */
    $.publish = function(type, data) {
        if (subscriptionMap[type]) {
            $.each(subscriptionMap[type], function(index, observer) {
                observer.notify(data);
                if (observer.isOneTimeUse) {
                    observer.destroy();
                    subscriptionMap[type].splice(index, 1);
                }
            });
        }
    }

    ///////////////////
    //OBSERVER CLASS //
    ///////////////////

    /**
     * The Observer Class
     *
     * Wraps an object and its method in such a way as to maintain scope.
     * 
     * @param {Object}   context the observing object
     * @param {Function} method  the method to call on the observing object
     */
    var Observer = function(context, method) {
        this.context = context;
        this.method = method;
    }
    Observer.prototype = {
        context:null,
        method:null,
        isOneTimeUse:false,
        notify: function(data) {
            if (this.method !== null && this.context !== null) {
                this.method.call(this.context, data);
            } else if (this.method !== null) {
                this.method.call(window, data);
            }
        },
        destroy: function() {
            this.context=null;
            this.method=null;
        }
    }
    
})(jQuery, window, document);