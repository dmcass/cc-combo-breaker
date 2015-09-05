(function ($) {
    "use strict";

    angular.module("cc-combo-breaker", [])
        .directive("combobreaker", function ($document) {
            return {
                restrict: "E",
                replace: true,
                template: "___TEMPLATE___",
                scope: {
                    list: "=",
                    ngModel: "=",
                    suggestionLimit: "@?",
                    strict: "@?",
                    placeholder: "@?"
                },
                link: function (scope, element, attrs) {
                    var input = element.find("input[type=text]"),
                        triggerEvent = scope.strict ? "change" : "input",
                        suggestionList = element.find(".cc-list"),
                        comparisonList = scope.list.map(function (val) {
                            return val.toUpperCase();
                        });

                    // Initialize ccSearch to the value of ngModel if possible
                    if (scope.strict) {
                        if (comparisonList.indexOf(scope.ngModel.toUpperCase()) > -1) {
                            scope.ccSearch = scope.ngModel;
                        } else {
                            scope.ccSearch = null;
                        }
                    } else {
                        scope.ccSearch = scope.ngModel;
                    }

                    if (isNaN(scope.suggestionLimit) || Number(scope.suggestionLimit) <= 1) {
                        scope.ccLimit = Infinity;
                    } else {
                        scope.ccLimit = parseInt(scope.suggestionLimit, 10);
                    }

                    $document.on("click", function (e) {
                        var tar = $(e.target),
                            suggestions;

                        if (element.hasClass("focus")) {
                            suggestions = element.find("li");

                            if (tar.is(suggestions)) {
                                input.val(tar.text()).trigger(triggerEvent);
                                suggestions.removeClass("selected");
                            }

                            if (!tar.is(input)) {
                                element.removeClass("focus");
                                suggestions.removeClass("selected");
                            }
                        } else if (tar.closest(element).length) {
                            element.addClass("focus");
                            input.trigger("focus");
                            if (!element.find(".selected").length) {
                                element.find("li").first().addClass("selected");
                            }
                        }
                    });

                    input.on("keydown", function (e) {
                        var item, selectedPos, selectedHeight,
                            scrollElem = element.find(".cc-suggestions"),
                            scrollHeight = scrollElem.height(),
                            selected = element.find(".selected");

                        if (e.which === 27) {
                            // escape: reset value & close
                            if (input.val() === "") {
                                input.val("").trigger(triggerEvent).trigger("blur");
                                element.removeClass("focus");
                            } else {
                                element.removeClass("focus");
                                input.val(scope.ngModel).trigger(triggerEvent).trigger("blur");
                            }
                        } else if (e.which === 9 || e.which === 13) {
                            // tab or enter: trigger change & close
                            if (selected.length) {
                                e.preventDefault();
                                input.val(selected.text()).trigger(triggerEvent).trigger("blur");
                                element.removeClass("focus");
                            }
                        } else if (e.which === 38) {
                            // up arrow: change selected
                            item = element.find("li").first();
                            if (!selected.is(item)) {
                                selected = selected.removeClass("selected").prev().addClass("selected");

                                // scroll with selection
                                selectedPos = selected.position();
                                selectedHeight = selected.outerHeight();
                                if (selectedPos.top < scrollElem.scrollTop()) {
                                     scrollElem.scrollTop(selectedPos.top);
                                }
                            }
                        } else if (e.which === 40) {
                            // down arrow: change selected
                            item = element.find("li").last();
                            if (!selected.is(item)) {
                                selected = selected.removeClass("selected").next().addClass("selected");

                                // scroll with selection
                                selectedPos = selected.position();
                                selectedHeight = selected.outerHeight();
                                if (selectedPos.top + selectedHeight > scrollElem.scrollTop() + scrollHeight) {
                                    scrollElem.scrollTop(selectedPos.top + selectedHeight - scrollElem.height());
                                }
                            }
                        }
                    });

                    suggestionList.on("mouseenter", "li", function (e) {
                        var tar = $(e.target);
                        tar.addClass("selected").siblings().removeClass("selected");
                    });

                    input.on("input", function () {
                        var selected = element.find("li.selected");

                        selected.removeClass("selected");
                        element.find("li").first().addClass("selected");

                        if (!scope.strict) {
                            scope.$apply(function () {
                                scope.ngModel = scope.ccSearch;
                            });
                        }
                    });

                    if (scope.strict) {
                        input.on("change", function () {
                            if (input.val() === "") {
                                element.find("li").first().addClass("selected");
                                scope.$apply(function () {
                                    scope.ngModel = null;
                                });
                            } else if (comparisonList.indexOf(input.val().toUpperCase()) > -1) {
                                scope.$apply(function () {
                                    scope.ngModel = scope.ccSearch;
                                });
                            } else {
                                element.addClass("cc-error");
                                input.val("").trigger("change");
                            }
                        });
                        // Animation complete - remove error class
                        element.on("animationend", function (e) {
                            if ($(e.target).is(input) && element.hasClass("cc-error")) {
                                element.removeClass("cc-error");
                            }
                        });
                    }
                }
            };
        });
})(jQuery);
