(function ($) {
    var defaultOptions = {
        changeHandler: 'disable'
    },

    methods = {
        changeHandlers : {
            'hide': function (element, enable) {
                element.toggle(enable);
            },

            'disable': function (element, enable) {
                if (enable) {
                    element.removeAttr("disabled");
                } else {
                    element.attr("disabled", "disabled");
                }
            }
        },

        elementsAreTruthy : function (elements) {
            var isTruthy = false;
            $.each(elements, function (index, selector) {
                isTruthy = (this.val() ? true : false);
                isTruthy = isTruthy && this.attr("checked");
                isTruthy = isTruthy && !this.attr("disabled");
                if (isTruthy) {
                    return false;
                }
            });
            return isTruthy;
        },

        registerDependencies : function (options) {
            var $element = this;

            $.each(options.elements, function (index, $el) {
                (function (element, elements, changeHandler) {
                    $el.live('change', function () {
                        var enable = methods.elementsAreTruthy(elements);

                        if (typeof changeHandler === 'function') {
                            changeHandler(element, enable);
                        } else {
                            if (changeHandler in methods.changeHandlers) {
                                methods.changeHandlers[changeHandler](element, enable);
                            } else {
                                methods.changeHandlers['disable'](element, enable);
                            }
                        }

                        methods.toggleTooltip(element, options.tooltip);
                    });
                })($element, options.elements, options.changeHandler);
            });
        },

        toggleTooltip : function (element, text) {
            if (element.attr("title") === text) {
                element.removeAttr("title");
            } else {
                element.attr("title", text);
            }
        }
    };

    $.fn.addDependency = function (options) {
        options = $.extend(defaultOptions, options);
        if (!options.elements) {
            return this;
        }

        methods.registerDependencies.call(this, options);

        if ($(this).is(":disabled")) {
            methods.toggleTooltip(this, options.tooltip);
        }

        return this;
    };
})(jQuery);
