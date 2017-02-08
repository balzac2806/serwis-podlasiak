interMap.controller('correctionsListController', ['$scope', '$rootScope', '$http', '$state', 'growl', '$uibModal', '$filter',
    function ($scope, $rootScope, $http, $state, growl, $uibModal, $filter) {

        $scope.sortType = 'created_at';
        $scope.sortReverse = true;

        var url = '/api/correction/';

        $scope.statuses = [
            'niezrealizowane',
            'zrealizowane'
        ];

        $scope.startDate = function () {
            $scope.popup = true;
        };


        $scope.getCorrections = function (sortParam, findParams) {
            return $http.get(url, {params: {sort: sortParam, find: findParams}});
        };

        $scope.search = {};

        $scope.searchCorrections = function (search) {
            var find = angular.copy(search);
            if (angular.isDefined(find.date)) {
                find.date = $filter('date')(find.date, 'yyyy-MM-dd');
            }
            $scope.getCorrections($scope.sort, find)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.corrections = response.data.data;
                            $scope.isFind = false;
                        }
                    });
        };

        $scope.clearSearch = function () {
            delete $scope.search.name;
            delete $scope.search.date;
            $scope.search = {};
            $scope.getCorrections($scope.sort)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.corrections = response.data.data;
                        }
                    });
        };

        $scope.$watch('search', function (newValue, oldValue) {
            $scope.check = false;
            if (angular.isDefined($scope.search.name)
                    || angular.isDefined($scope.search.date)) {
                $scope.check = true;
            } else {
                $scope.check = false;
            }
        }, true);

        $scope.getCorrections()
                .then(function (response) {
                    if (response.data.success) {
                        $scope.corrections = response.data.data;
                        $scope.sort = 'name';
                    }
                });

        $scope.addCorrection = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/front/views/corrections/components/modal/correction.tpl.html',
                controller: 'correctionModalController',
                resolve: {
                    correction: function () {
                        return {
                        };
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $state.go($state.current, {}, {reload: true});
                growl.addSuccessMessage('Poprawka została dodana pomyślnie !');
            });
        };

        $scope.$watch('sort', function (newVal, oldVal) {
            if (angular.isDefined(oldVal) && angular.isDefined(newVal) && newVal != oldVal) {
                $scope.getCorrections(newVal)
                        .then(function (response) {
                            if (response.data.success) {
                                $scope.corrections = response.data.data;
                            }
                        });
            }
        });

        $scope.removeCorrection = function (id) {
            $http.delete(url + id).
                    success(function (data) {
                        if (data.success) {
                            angular.forEach($scope.corrections, function (val, key) {
                                if (val.id == id) {
                                    $scope.corrections.splice(key, 1);
                                }
                            });
                            growl.addSuccessMessage('Poprawka została usunięta !');
                        } else if (data.error) {
                            growl.addErrorMessage(data.error);
                        }
                    });
        };

    }]);

interMap.controller('correctionPageController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', '$uibModal', function ($scope, $stateParams, $rootScope, $http, $state, growl, $uibModal) {

        if (angular.isDefined($stateParams.correctionId)) {
            $scope.correctionId = $stateParams.correctionId;
        }

        $scope.statuses = [
            {
                id: 1,
                name: 'niezrealizowane'
            },
            {
                id: 2,
                name: 'zrealizowane'
            }
        ];

        $scope.isLoading = true;

        $scope.correction = {};

        var url = '/api/correction/';

        if (angular.isDefined($scope.correctionId)) {
            $scope.editMode = true;

            $http.get(url + $scope.correctionId)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.correction = response.data.correction;
                            if (angular.isDefinedNotNull($scope.correction.date)) {
                                $scope.correction.date = new Date($scope.correction.date);
                            } else {
                                $scope.correction.date = null;
                            }
                            if ($scope.correction.status == 1) {
                                $scope.correction.status = $scope.statuses[0];
                            } else {
                                $scope.correction.status = $scope.statuses[1];
                            }
                        } else {
                            growl.addErrorMessage(response.data.error);
                        }
                    })
                    .finally(function () {
                        $scope.isLoading = false;
                    });
        }


        $scope.cancel = function () {
            $state.go('correctionsList');
        };

        $scope.saveCorrection = function () {
            $scope.isLoading = true;
            $http.put(url + $scope.correction.id, $scope.correction).
                    success(function (data) {
                        if (data.success) {
                            $state.go('correctionsList');
                            growl.addSuccessMessage('Poprawka została zaktualizowana pomyślnie !');
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się zaktualizować poprawki !');
                            }
                        }
                    }).
                    finally(function () {
                        $scope.isLoading = false;
                    });
        };
        
    }]);

interMap.controller('correctionModalController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', 'correction', '$uibModalInstance', function ($scope, $stateParams, $rootScope, $http, $state, growl, product, $uibModalInstance) {

        $scope.correction = {};

        $scope.statuses = [
            {
                id: 1,
                name: 'niezrealizowane'
            },
            {
                id: 2,
                name: 'zrealizowane'
            }
        ];

        $scope.correction.status = $scope.statuses[0];

        var url = '/api/correction/';

        $scope.save = function () {
            $scope.isLoading = true;
            $http.post(url, $scope.correction).
                    success(function (data) {
                        if (data.success) {
                            $uibModalInstance.close(data.correction);
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się dodać poprawki !');
                            }
                        }
                    }).
                    finally(function () {
                        $scope.isLoading = false;
                    });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);