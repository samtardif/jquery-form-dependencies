(function ($) {
    var defaultOptions = {
        changeHandler: 'disable'
    },

    eventTypes = {
        'INPUT' : {
            'checkbox' : 'change',
            'text' : 'keyup',
            undefined : 'keyup'
        },
        'SELECT' : {
            undefined : 'change'
        }
    },

    methods = {
        changeHandlers : {
            hide: function (element, enable) {
                element.toggle(enable);
            },

            disable: function (element, enable) {
                if (enable) {
                    element.removeAttr("disabled");
                } else {
                    element.attr("disabled", "disabled");
                }
            }
        },

        truthyTests : {
            baseTest : function (element) {
                var isTruthy = (element.val() ? true : false);
                isTruthy = isTruthy && !element.attr("disabled");
                return isTruthy;
            },

            checkbox : function (element) {
                return element.attr("checked");
            }
        },

        elementsAreTruthy : function (elements) {
            var isTruthy = false, element_type;
            $.each(elements, function (index, selector) {
                isTruthy = methods.truthyTests.baseTest(this);
                element_type = this.attr('type');
                if (methods.truthyTests[element_type]) {
                    isTruthy = isTruthy && methods.truthyTests[element_type](this);
                }

                if (isTruthy) {
                    return false;
                }
            });

            return isTruthy;
        },

        registerDependencies : function (options) {
            var $element = this;

            $.each(options.elements, function (index, $dependencyElement) {
                (function ($dependency, $dependent, dependencies, changeHandler) {
                    var eventType = eventTypes[$dependency.get(0).tagName][$dependency.attr('type')];
                    $dependency.live(eventType, function () {
                        var enable = methods.elementsAreTruthy(dependencies);

                        if (typeof changeHandler === 'function') {
                            changeHandler($dependent, enable);
                        } else {
                            if (changeHandler in methods.changeHandlers) {
                                methods.changeHandlers[changeHandler]($dependent, enable);
                            } else {
                                methods.changeHandlers.disable($dependent, enable);
                            }
                        }

                        methods.toggleTooltip($dependent, options.tooltip);
                    });
                })($dependencyElement, $element, options.elements, options.changeHandler);
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
        options = $.extend({}, defaultOptions, options);
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
