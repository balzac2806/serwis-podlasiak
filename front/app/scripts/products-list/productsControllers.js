interMap.controller('productsListController', ['$scope', '$rootScope', '$http', '$state', 'growl', '$uibModal', '$filter',
    function ($scope, $rootScope, $http, $state, growl, $uibModal, $filter) {
        $scope.currentPage = 1;
        $scope.pageSize = 100;
        $scope.totalData = 100;

        $scope.sortType = 'created_at';
        $scope.sortReverse = true;

        var url = '/api/product/';

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

        $scope.getProducts = function (page, sortParam, findParams) {
            return $http.get(url, {params: {page: page, sort: sortParam, find: findParams}});
        };

        $scope.search = {};

        $scope.searchProducts = function (search) {
            var find = angular.copy(search);
            if (angular.isDefined(find.date)) {
                find.date = $filter('date')(find.date, 'yyyy-MM-dd');
            }
            $scope.getProducts(1, $scope.sort, find)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.lastPage = response.data.data.last_page;
                        $scope.currentPage = response.data.data.current_page;
                        $scope.totalData = response.data.data.total;
                        $scope.products = response.data.data.data;
                        $scope.isFind = false;
                    }
                });
        };

        $scope.startDate = function () {
            $scope.popup = true;
        };

        $scope.clearSearch = function () {
            delete $scope.search.name;
            delete $scope.search.person;
            delete $scope.search.date;
            $scope.search = {};
            $scope.getProducts(1, $scope.sort)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.lastPage = response.data.data.last_page;
                        $scope.currentPage = response.data.data.current_page;
                        $scope.totalData = response.data.data.total;
                        $scope.products = response.data.data.data;
                    }
                });
        };

        $scope.$watch('search', function (newValue, oldValue) {
            $scope.check = false;
            if (angular.isDefined($scope.search.name)
                    || angular.isDefined($scope.search.person)
                    || angular.isDefined($scope.search.date)) {
                $scope.check = true;
            } else {
                $scope.check = false;
            }
        }, true);

        $scope.getProducts($scope.currentPage)
            .then(function (response) {
                if (response.data.success) {
                    $scope.lastPage = response.data.data.last_page;
                    $scope.currentPage = response.data.data.current_page;
                    $scope.totalData = response.data.data.total;
                    $scope.products = response.data.data.data;
                    $scope.sort = 'name';
                }
            });

        $scope.addProduct = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/front/views/products-list/components/modal/product.tpl.html',
                controller: 'productModalController',
                resolve: {
                    product: function () {
                        return {};
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $state.go($state.current, {}, {reload: true});
                growl.addSuccessMessage('Produkt został dodany pomyślnie !');
            });
        };

        $scope.pageChanged = function () {
            $scope.getProducts($scope.currentPage, $scope.sort)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.lastPage = response.data.data.last_page;
                        $scope.currentPage = response.data.data.current_page;
                        $scope.totalData = response.data.data.total;
                        $scope.products = response.data.data.data;
                    }
                });
        };

        $scope.$watch('sort', function (newVal, oldVal) {
            if (angular.isDefined(oldVal) && angular.isDefined(newVal) && newVal != oldVal) {
                $scope.getProducts(newVal)
                        .then(function (response) {
                            if (response.data.success) {
                                $scope.products = response.data.data;
                            }
                        });
            }
        });

        $scope.removeProduct = function (id) {
            $http.delete(url + id).
                    success(function (data) {
                        if (data.success) {
                            angular.forEach($scope.products, function (val, key) {
                                if (val.id == id) {
                                    $scope.products.splice(key, 1);
                                }
                            });
                            growl.addSuccessMessage('Produkt został usunięty !');
                        } else if (data.error) {
                            growl.addErrorMessage(data.error);
                        }
                    });
        };
    }]);

interMap.controller('productPageController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', '$uibModal', function ($scope, $stateParams, $rootScope, $http, $state, growl, $uibModal) {

        if (angular.isDefined($stateParams.productId)) {
            $scope.productId = $stateParams.productId;
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

        $scope.product = {};

        var url = '/api/product/';

        if (angular.isDefined($scope.productId)) {
            $scope.editMode = true;

            $http.get(url + $scope.productId)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.product = response.data.product;
                            if ($scope.product.status == 1) {
                                $scope.product.status = $scope.statuses[0];
                            } else {
                                $scope.product.status = $scope.statuses[1];
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
            $state.go('productsList');
        };

        $scope.saveProduct = function () {
            $scope.isLoading = true;
            $scope.product.editor = $rootScope.permissions.user.name;
            $http.put(url + $scope.product.id, $scope.product).
                    success(function (data) {
                        if (data.success) {
                            $state.go('productsList');
                            growl.addSuccessMessage('Produkt został zaktualizowany pomyślnie !');
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się zaktualizować produktu !');
                            }
                        }
                    }).
                    finally(function () {
                        $scope.isLoading = false;
                    });
        };

    }]);

interMap.controller('productModalController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', 'product', '$uibModalInstance', function ($scope, $stateParams, $rootScope, $http, $state, growl, product, $uibModalInstance) {

        $scope.product = {};

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

        $scope.product.status = $scope.statuses[0];
        $scope.product.person = $rootScope.permissions.user.name;

        if (angular.isDefined(product.name)) {
            $scope.productId = product.id;
            $scope.product = product;
        }

        var url = '/api/product/';

        $scope.save = function () {
            $scope.isLoading = true;
            $http.post(url, $scope.product).
                    success(function (data) {
                        if (data.success) {
                            $uibModalInstance.close(data.product);
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się dodać produktu !');
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