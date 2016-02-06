(function () {
    "use strict";

    angular.module("cc-example", ["cc-combo-breaker"])
        .controller("ExampleController", ["$scope", function ($scope) {
        $scope.states = [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California",
            "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
            "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
            "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
            "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
            "Nebraska", "Nevada", "New Hampshire", "New Jersey",
            "New Mexico", "New York", "North Carolina", "North Dakota",
            "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
            "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
            "Vermont", "Virginia", "Washington", "West Virginia",
            "Wisconsin", "Wyoming"
        ];
        $scope.exampleModel = "Minnesota";

        $scope.test = function () {
            var random = Math.floor(Math.random() * 50);

            $scope.exampleModel = $scope.states[random];
        };

        $scope.bogus = function () {
            $scope.exampleModel = "foo";
        };
    }]);
})();
