interMap.controller('dashboardController', ['$scope', '$http', '$state', 'growl', function ($scope, $http, $state, growl) {
        $scope.dashboard = {};

        var url = '/api/dashboard/';

        $http.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.dashboard = response.data.dashboard;
                    } else {
                        growl.addErrorMessage(response.data.error);
                    }
                })
                .finally(function () {
                    $scope.isLoading = false;
                });
    }]);

interMap.controller('dashboardEditController', ['$scope', '$http', '$state', 'growl', function ($scope, $http, $state, growl) {
        $scope.isLoading = true;

        $scope.dashboard = {};

        var url = '/api/dashboard/';

        $http.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.dashboard = response.data.dashboard;
                    } else {
                        growl.addErrorMessage(response.data.error);
                    }
                })
                .finally(function () {
                    $scope.isLoading = false;
                });


        $scope.cancel = function () {
            $state.go('dashboard');
        };

        $scope.saveDashboard = function () {
            $scope.isLoading = true;
            $http.post(url, $scope.dashboard).
                    success(function (data) {
                        if (data.success) {
                            $state.go('dashboard');
                            growl.addSuccessMessage('Dashboard został zaktualizowany pomyślnie !');
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się zaktualizować dashboardu !');
                            }
                        }
                    }).
                    finally(function () {
                        $scope.isLoading = false;
                    });
        };
    }]);
