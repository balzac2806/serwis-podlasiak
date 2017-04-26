interMap.controller('returnsListController', ['$scope', '$rootScope', '$http', '$state', 'growl', '$uibModal', '$filter',
    function ($scope, $rootScope, $http, $state, growl, $uibModal, $filter) {

        $scope.sortType = 'id';
        $scope.sortReverse = true;

        var url = '/api/orders/';

        $scope.statuses = [
            'niezrealizowane',
            'zrealizowane'
        ];

        $scope.search = {};
        $scope.companies = ['Podlasiak', 'Fonti', 'Wszystkie'];
        $scope.search.company = $scope.companies[2];

        $scope.popup = false;

        $scope.dateOptions = {
            dateDisabled: false,
            formatYear: 'yy',
            startingDay: 1,
        };

        $scope.startDate = function () {
            $scope.popup = true;
        };

        $scope.getOrders = function (sortParam, findParams) {
            return $http.get(url, {params: {sort: sortParam, find: findParams}});
        };

        $scope.searchOrders = function (search) {
            var find = angular.copy(search);
            if (angular.isDefined(find.date)) {
                find.date = $filter('date')(find.date, 'yyyy-MM-dd');
            }
            $scope.getOrders($scope.sort, find)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.returners = response.data.data;
                            $scope.isFind = false;
                        }
                    });
        };

        $scope.clearSearch = function () {
            delete $scope.search.name;
            delete $scope.search.person;
            delete $scope.search.date;
            delete $scope.search.sender;
            delete $scope.search.number;
            delete $scope.search.document;
            $scope.search = {};
            $scope.search.company = $scope.companies[2];
            $scope.getOrders($scope.sort)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.returners = response.data.data;
                        }
                    });
        };

        $scope.$watch('search', function (newValue, oldValue) {
            $scope.check = false;
            if (angular.isDefined($scope.search.name)
                    || angular.isDefined($scope.search.person)
                    || angular.isDefined($scope.search.sender)
                    || angular.isDefined($scope.search.number)
                    || angular.isDefined($scope.search.company)
                    || angular.isDefined($scope.search.document)
                    || angular.isDefined($scope.search.date)) {
                $scope.check = true;
            } else {
                $scope.check = false;
            }
        }, true);

        $scope.getOrders()
                .then(function (response) {
                    if (response.data.success) {
                        $scope.returners = response.data.data;
                        $scope.sort = 'name';
                    }
                });

        $scope.addOrder = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/front/views/returns-list/components/modal/return.tpl.html',
                controller: 'returnModalController',
                resolve: {
                    order: function () {
                        return {
                        };
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $state.go($state.current, {}, {reload: true});
                growl.addSuccessMessage('Protokół zwrotu został dodany pomyślnie !');
            });
        };

        $scope.$watch('sort', function (newVal, oldVal) {
            if (angular.isDefined(oldVal) && angular.isDefined(newVal) && newVal != oldVal) {
                $scope.getOrders(newVal)
                        .then(function (response) {
                            if (response.data.success) {
                                $scope.returners = response.data.data;
                            }
                        });
            }
        });

        $scope.removeOrder = function (id) {
            $http.delete(url + id).
                    success(function (data) {
                        if (data.success) {
                            angular.forEach($scope.returners, function (val, key) {
                                if (val.id == id) {
                                    $scope.returners.splice(key, 1);
                                }
                            });
                            growl.addSuccessMessage('Protokół zwrotu został usunięty !');
                        } else if (data.error) {
                            growl.addErrorMessage(data.error);
                        }
                    });
        };

    }]);

interMap.controller('returnPageController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', '$uibModal', function ($scope, $stateParams, $rootScope, $http, $state, growl, $uibModal) {

        if (angular.isDefined($stateParams.returnId)) {
            $scope.returnId = $stateParams.returnId;
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

        $scope.companies = [
            'Podlasiak',
            'Fonti'
        ];

        $scope.isLoading = true;

        $scope.order = {};

        var url = '/api/orders/';

        if (angular.isDefined($scope.returnId)) {
            $scope.editMode = true;

            $http.get(url + $scope.returnId)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.order = response.data.order;
                            if (angular.isDefined($scope.order.date)) {
                                $scope.order.date = new Date($scope.order.date);
                            } else {
                                $scope.order.date = new Date();
                            }
                            if (angular.isDefined($scope.order.created_at)) {
                                $scope.order.created_at = new Date($scope.order.created_at);
                            } else {
                                $scope.order.created_at = new Date();
                            }
                            if ($scope.order.status == 1) {
                                $scope.order.status = $scope.statuses[0];
                            } else {
                                $scope.order.status = $scope.statuses[1];
                            }
                            $scope.order.authoriser = $rootScope.permissions.user.name;
                        } else {
                            growl.addErrorMessage(response.data.error);
                        }
                    })
                    .finally(function () {
                        $scope.isLoading = false;
                    });
        }


        $scope.cancel = function () {
            $state.go('returnsList');
        };

        $scope.saveOrder = function () {
            $scope.isLoading = true;
            $scope.order.editor = $rootScope.permissions.user.name;
            $http.put(url + $scope.order.id, $scope.order).
                    success(function (data) {
                        if (data.success) {
                            $state.go('returnsList');
                            growl.addSuccessMessage('Protokół zwrotu został zaktualizowany pomyślnie !');
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się zaktualizować protokołu zwrotu !');
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

interMap.controller('returnModalController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', 'order', '$uibModalInstance', function ($scope, $stateParams, $rootScope, $http, $state, growl, order, $uibModalInstance) {

        $scope.order = {};

        $scope.companies = [
            'Podlasiak',
            'Fonti'
        ];

        if (angular.isDefined(order.name)) {
            $scope.orderId = order.id;
            $scope.order = order;
        }
        $scope.order.created_at = new Date();
        $scope.order.company = $scope.companies[0];

        var url = '/api/orders/';

        $scope.save = function () {
            $scope.isLoading = true;
            $http.post(url, $scope.order).
                    success(function (data) {
                        if (data.success) {
                            $uibModalInstance.close(data.order);
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się dodać protokołu zwrotu !');
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