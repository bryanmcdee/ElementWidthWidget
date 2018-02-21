(function ($) {
    var _resizeTimer;

    $.widget("BryanMcDeeWidget.elementWidth", {
        options: {
            callback: null,
            minWidthAllowed: 400,
            defaultWidth: 1000
        },
        _create: function () {
            this._element = this.element;
            this._setElementWidth();
            this._addSubscriber(this.options.callback);
            this._bindWindowResizeEvent();
        },
        _setOption: function (key, value) {
            if (key == 'callback') {
                this._addSubscriber(value);
            }
        },
        _init: function () { },

        /* Private Fields*/
        _element: null,
        _elementWidth: null,
        _subscribers: [],

        /* Private Methods */
        _addSubscriber: function (subscriber) {
            if ($.isFunction(subscriber)) {
                this._subscribers.push(subscriber);
            }
            else if ($.type(subscriber) === "array") {
                $.each(subscriber, function (index, singleSubscriber) {
                    if ($.isFunction(singleSubscriber)) {
                        this._subscribers.push(singleSubscriber);
                    }
                });
            }
        },
        _setElementWidth: function () {
            if (this._element) {
                var elementWidth = this._element.width();
                var parcedElementWidth = elementWidth ? parseInt(elementWidth, 10) : this.options.defaultWidth;
                if (isNaN(parcedElementWidth)) {
                    parcedElementWidth = this.options.defaultWidth;
                } else if (parcedElementWidth < this.options.minWidthAllowed) {
                    parcedElementWidth = this.options.minWidthAllowed;
                }
                this._elementWidth = parcedElementWidth;
            } else {
                this._elementWidth = this.options.defaultWidth;
            }
        },
        _getElementWidth: function () {
            this._setElementWidth();
            return this._elementWidth;
        },
        _bindWindowResizeEvent: function () {
            var self = this;
            $(window).on('resize', function (e) {
                clearTimeout(_resizeTimer);
                _resizeTimer = setTimeout(function () {
                    var width = self._getElementWidth();
                    self._onWidthChange(width);
                    $.each(self._subscribers, function (index, subscriber) {
                        subscriber(width);
                    });
                }, 250);
            });
        },

        /* Public Methods */
        subscribe: function (callback) {
            this._addSubscriber(callback);
        },
        get: function () {
            return this._getElementWidth();
        },

        /* Event Raising Methods*/
        _onWidthChange: function (width) {
            this._trigger("onWidthChange", null, width);
        }
    });
}(jQuery));