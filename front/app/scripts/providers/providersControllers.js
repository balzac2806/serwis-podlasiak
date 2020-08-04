interMap.controller('providersListController', ['$scope', '$rootScope', '$http', '$state', 'growl', '$uibModal', '$filter',
    function ($scope, $rootScope, $http, $state, growl, $uibModal, $filter) {
        $scope.currentPage = 1;
        $scope.pageSize = 100;
        $scope.totalData = 100;

        $scope.sortType = 'created_at';
        $scope.sortReverse = true;

        var url = '/api/provider/';

        $scope.statuses = [
            'niezrealizowane',
            'zrealizowane'
        ];

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


        $scope.getProviders = function (page, sortParam, findParams) {
            return $http.get(url, {params: {page: page, sort: sortParam, find: findParams}});
        };

        $scope.search = {};

        $scope.searchProviders = function (search) {
            var find = angular.copy(search);
            if (angular.isDefined(find.date)) {
                find.date = $filter('date')(find.date, 'yyyy-MM-dd');
            }
            $scope.getProviders(1, $scope.sort, find)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.lastPage = response.data.data.last_page;
                        $scope.currentPage = response.data.data.current_page;
                        $scope.totalData = response.data.data.total;
                        $scope.providers = response.data.data.data;
                        $scope.isFind = false;
                    }
                });
        };

        $scope.clearSearch = function () {
            delete $scope.search.name;
            delete $scope.search.date;
            $scope.search = {};
            $scope.getProviders(1, $scope.sort, find)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.lastPage = response.data.data.last_page;
                        $scope.currentPage = response.data.data.current_page;
                        $scope.totalData = response.data.data.total;
                        $scope.providers = response.data.data.data;
                        $scope.isFind = false;
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

        $scope.getProviders($scope.currentPage)
            .then(function (response) {
                if (response.data.success) {
                    $scope.lastPage = response.data.data.last_page;
                    $scope.currentPage = response.data.data.current_page;
                    $scope.totalData = response.data.data.total;
                    $scope.providers = response.data.data.data;
                    $scope.sort = 'name';
                }
            });

        $scope.addProvider = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/front/views/providers/components/modal/provider.tpl.html',
                controller: 'providerModalController',
                resolve: {
                    provider: function () {
                        return {
                        };
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $state.go($state.current, {}, {reload: true});
                growl.addSuccessMessage('Dostawa została dodana pomyślnie !');
            });
        };

        $scope.$watch('sort', function (newVal, oldVal) {
            if (angular.isDefined(oldVal) && angular.isDefined(newVal) && newVal != oldVal) {
                $scope.getProviders(1, newVal, $scope.find)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.lastPage = response.data.data.last_page;
                            $scope.currentPage = response.data.data.current_page;
                            $scope.totalData = response.data.data.total;
                            $scope.providers = response.data.data.data;
                        }
                    });
            }
        });

        $scope.removeProvider = function (id) {
            $http.delete(url + id).
                    success(function (data) {
                        if (data.success) {
                            angular.forEach($scope.providers, function (val, key) {
                                if (val.id == id) {
                                    $scope.providers.splice(key, 1);
                                }
                            });
                            growl.addSuccessMessage('Dostawa została usunięta !');
                        } else if (data.error) {
                            growl.addErrorMessage(data.error);
                        }
                    });
        };

        $scope.pageChanged = function() {
            $scope.getProviders($scope.currentPage, $scope.sort, $scope.find)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.lastPage = response.data.data.last_page;
                        $scope.currentPage = response.data.data.current_page;
                        $scope.totalData = response.data.data.total;
                        $scope.providers = response.data.data.data;
                    }
                });
        };
    }]);

interMap.controller('providerPageController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', '$uibModal', function ($scope, $stateParams, $rootScope, $http, $state, growl, $uibModal) {

        if (angular.isDefined($stateParams.providerId)) {
            $scope.providerId = $stateParams.providerId;
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

        $scope.provider = {};

        var url = '/api/provider/';

        if (angular.isDefined($scope.providerId)) {
            $scope.editMode = true;

            $http.get(url + $scope.providerId)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.provider = response.data.provider;
                            if (angular.isDefinedNotNull($scope.provider.date)) {
                                $scope.provider.date = new Date($scope.provider.date);
                            } else {
                                $scope.provider.date = null;
                            }
                            if ($scope.provider.status == 1) {
                                $scope.provider.status = $scope.statuses[0];
                            } else {
                                $scope.provider.status = $scope.statuses[1];
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
            $state.go('providersList');
        };

        $scope.saveProvider = function () {
            $scope.isLoading = true;
            $http.put(url + $scope.provider.id, $scope.provider).
                    success(function (data) {
                        if (data.success) {
                            $state.go('providersList');
                            growl.addSuccessMessage('Dostawa została zaktualizowana pomyślnie !');
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się zaktualizować dostawy !');
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
            startDate: new Date()
        };

        $scope.startDate = function () {
            $scope.popup = true;
        };

    }]);

interMap.controller('providerModalController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', 'provider', '$uibModalInstance', function ($scope, $stateParams, $rootScope, $http, $state, growl, product, $uibModalInstance) {

        $scope.provider = {};

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

        $scope.provider.status = $scope.statuses[0];

        var url = '/api/provider/';

        $scope.save = function () {
            $scope.isLoading = true;
            $http.post(url, $scope.provider).
                    success(function (data) {
                        if (data.success) {
                            $uibModalInstance.close(data.provider);
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się dodać dostawy !');
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
            startDate: new Date()
        };

        $scope.startDate = function () {
            $scope.popup = true;
        };

    }]);