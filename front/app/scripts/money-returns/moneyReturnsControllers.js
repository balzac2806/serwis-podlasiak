interMap.controller('moneyReturnsListController', ['$scope', '$rootScope', '$http', '$state', 'growl', '$uibModal', '$filter',
    function ($scope, $rootScope, $http, $state, growl, $uibModal, $filter) {

        $scope.sortType = 'created_at';
        $scope.sortReverse = true;

        var url = '/api/money-returns/';

        $scope.popup = false;

        $scope.dateOptions = {
            dateDisabled: false,
            formatYear: 'yy',
            startingDay: 1,
        };

        $rootScope.showButtonBar = false;


        $scope.startDate = function () {
            $scope.popup = true;
        };


        $scope.getMoneyReturns = function (sortParam, findParams) {
            return $http.get(url, {params: {sort: sortParam, find: findParams}});
        };

        $scope.search = {};

        $scope.searchMoneyReturns = function (search) {
            var find = angular.copy(search);
            if (angular.isDefined(find.date)) {
                find.date = $filter('date')(find.date, 'yyyy-MM-dd');
            }
            $scope.getMoneyReturns($scope.sort, find)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.moneyReturns = response.data.data;
                            $scope.isFind = false;
                        }
                    });
        };

        $scope.clearSearch = function () {
            delete $scope.search.person;
            delete $scope.search.subiect;
            delete $scope.search.date;
            $scope.search = {};
            $scope.getMoneyReturns($scope.sort)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.moneyReturns = response.data.data;
                        }
                    });
        };

        $scope.$watch('search', function (newValue, oldValue) {
            $scope.check = false;
            if (angular.isDefined($scope.search.subiect)
                    || angular.isDefined($scope.search.person)
                    || angular.isDefined($scope.search.date)) {
                $scope.check = true;
            } else {
                $scope.check = false;
            }
        }, true);

        $scope.getMoneyReturns()
                .then(function (response) {
                    if (response.data.success) {
                        $scope.moneyReturns = response.data.data;
                        $scope.sort = 'updated_at';
                    }
                });

        $scope.addMoneyReturn = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/front/views/money-returns/components/modal/return.tpl.html',
                controller: 'moneyReturnModalController',
                resolve: {
                    moneyReturn: function () {
                        return {
                        };
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $state.go($state.current, {}, {reload: true});
                growl.addSuccessMessage('Zwrot pieniędzy został dodany pomyślnie !');
            });
        };

        $scope.$watch('sort', function (newVal, oldVal) {
            if (angular.isDefined(oldVal) && angular.isDefined(newVal) && newVal != oldVal) {
                $scope.getMoneyReturns(newVal)
                        .then(function (response) {
                            if (response.data.success) {
                                $scope.moneyReturns = response.data.data;
                            }
                        });
            }
        });

        $scope.removeMoneyReturn = function (id) {
            $http.delete(url + id).
                    success(function (data) {
                        if (data.success) {
                            angular.forEach($scope.moneyReturns, function (val, key) {
                                if (val.id == id) {
                                    $scope.moneyReturns.splice(key, 1);
                                }
                            });
                            growl.addSuccessMessage('Zwrot pieniędzy został usunięty !');
                        } else if (data.error) {
                            growl.addErrorMessage(data.error);
                        }
                    });
        };

    }]);

interMap.controller('moneyReturnPageController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', '$uibModal', function ($scope, $stateParams, $rootScope, $http, $state, growl, $uibModal) {

        if (angular.isDefined($stateParams.returnId)) {
            $scope.returnId = $stateParams.returnId;
        }

        $scope.isLoading = true;

        $scope.moneyReturn = {};

        var url = '/api/money-returns/';

        if (angular.isDefined($scope.returnId)) {
            $scope.editMode = true;

            $http.get(url + $scope.returnId)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.moneyReturn = response.data.data;
                            if (angular.isDefined($scope.moneyReturn.date)) {
                                $scope.moneyReturn.date = new Date($scope.moneyReturn.date);
                            } else {
                                $scope.moneyReturn.date = new Date();
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
            $state.go('moneyReturns');
        };

        $scope.saveMoneyReturn = function () {
            $scope.isLoading = true;
            $http.put(url + $scope.moneyReturn.id, $scope.moneyReturn).
                    success(function (data) {
                        if (data.success) {
                            $state.go('moneyReturns');
                            growl.addSuccessMessage('Zwrot pieniędzy został zaktualizowany pomyślnie !');
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się zaktualizować zwrotu pieniędzy !');
                            }
                        }
                    }).
                    finally(function () {
                        $scope.isLoading = false;
                    });
        };

        $scope.popup = false;

        $scope.dateOptions = {
            dateDisabled: false,
            formatYear: 'yy',
            startingDay: 1,
        };

        $scope.startDate = function () {
            $scope.popup = true;
        };

    }]);

interMap.controller('moneyReturnModalController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', 'moneyReturn', '$uibModalInstance', function ($scope, $stateParams, $rootScope, $http, $state, growl, moneyReturn, $uibModalInstance) {

        $scope.moneyReturn = {};

        $scope.moneyReturn.person = $rootScope.permissions.user.name;

        if (angular.isDefined(moneyReturn.subiect)) {
            $scope.returnId = moneyReturn.id;
            $scope.moneyReturn = moneyReturn;
        }

        var url = '/api/money-returns/';

        $scope.save = function () {
            $scope.isLoading = true;
            $http.post(url, $scope.moneyReturn).
                    success(function (data) {
                        if (data.success) {
                            $uibModalInstance.close(data.data);
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się dodać zwrotu pieniędzy !');
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

        $scope.popup = false;

        $scope.dateOptions = {
            dateDisabled: false,
            formatYear: 'yy',
            startingDay: 1,
        };

        $scope.startDate = function () {
            $scope.popup = true;
        };

    }]);