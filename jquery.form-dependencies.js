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
            var result = false;
            $.each(elements, function (index, selector) {
                var isTruthy = (this.val() ? true : false);
                isTruthy = isTruthy && this.attr("checked");
                isTruthy = isTruthy && !this.attr("disabled");
                if (isTruthy) {
                    result = isTruthy;
                    return false;
                }
            });
            return result;
        },

        registerDependencies : function (options) {
            var $element = this;

            $.each(options.elements, function (index, $el) {
                (function (element, elements, changeHandler) {
                    $el.live('change', function () {
                        var enable = methods.elementsAreTruthy(elements);
                        if (changeHandler in methods.changeHandlers) {
                            methods.changeHandlers[changeHandler](element, enable);
                        } else {
                            methods.changeHandlers['disable'](element, enable);
                        }
                    });
                })($element, options.elements, options.changeHandler);
            });
        }
    };

    $.fn.addDependency = function (options) {
        options = $.extend(defaultOptions, options);
        if (!options.elements) {
            return this;
        }

        methods.registerDependencies.call(this, options);

        if (options.tooltip) {
            this.attr("title", options.tooltip);
        }

        return this;
    };
})(jQuery);
