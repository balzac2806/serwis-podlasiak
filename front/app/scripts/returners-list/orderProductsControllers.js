interMap.controller('orderProductsListController', ['$scope', '$rootScope', '$http', '$state', 'growl', '$uibModal', '$filter', '$stateParams',
    function ($scope, $rootScope, $http, $state, growl, $uibModal, $filter, $stateParams) {

        $scope.sortType = 'created_at';
        $scope.sortReverse = true;

        if (angular.isDefined($stateParams.returnId)) {
            $scope.orderId = $stateParams.returnId;
        }

        var url = '/api/order-products/';

        $http.get('/api/orders/' + $scope.orderId)
                .then(function (response) {
                    $scope.order = response.data.order;
                });

        $scope.getProducts = function (orderId, sortParam, findParams) {
            return $http.get(url, {params: {sort: sortParam, find: findParams, order_id: orderId}});
        };

        $scope.getProducts($scope.orderId)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.products = response.data.data;
                        $scope.sort = 'name';
                    }
                });

        $scope.addProduct = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/front/views/returns-list/components/modal/product.tpl.html',
                controller: 'orderProductModalController',
                resolve: {
                    product: function () {
                        return {
                            order_id: $scope.orderId
                        };
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $state.go($state.current, {}, {reload: true});
                growl.addSuccessMessage('Przesyłka została dodana pomyślnie !');
            });
        };

        $scope.removeProduct = function (id) {
            $http.delete(url + id).
                    success(function (data) {
                        if (data.success) {
                            angular.forEach($scope.products, function (val, key) {
                                if (val.id == id) {
                                    $scope.products.splice(key, 1);
                                }
                            });
                            growl.addSuccessMessage('Przesyłka została usunięta !');
                        } else if (data.error) {
                            growl.addErrorMessage(data.error);
                        }
                    });
        };

        $scope.cancel = function () {
            $state.go('returnsList');
        };

    }]);

interMap.controller('orderProductPageController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', '$uibModal', function ($scope, $stateParams, $rootScope, $http, $state, growl, $uibModal) {

        if (angular.isDefined($stateParams.productId)) {
            $scope.productId = $stateParams.productId;
        }

        $scope.statuses = ['OK', 'S', 'ZN'];

        $scope.isLoading = true;

        $scope.product = {};

        var url = '/api/order-products/';

        if (angular.isDefined($scope.productId)) {
            $scope.editMode = true;

            $http.get(url + $scope.productId)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.product = response.data.product;
                            if (angular.isDefinedNotNull($scope.product.date)) {
                                $scope.product.date = new Date($scope.product.date);
                            } else {
                                $scope.product.date = null;
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
            $state.go('orderProductsList', {returnId: $scope.product.order_id});
        };

        $scope.saveProduct = function () {
            $scope.isLoading = true;
            $http.put(url + $scope.product.id, $scope.product).
                    success(function (data) {
                        if (data.success) {
                            $state.go('orderProductsList', {returnId: $scope.product.order_id});
                            growl.addSuccessMessage('Przesyłka została zaktualizowana pomyślnie !');
                        } else {
                            if (typeof data.error === 'object') {
                                $scope.formErrors = data.error;
                            } else {
                                growl.addErrorMessage('Nie udało się zaktualizować przesyłki!');
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

interMap.controller('orderProductModalController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', 'product', '$uibModalInstance', function ($scope, $stateParams, $rootScope, $http, $state, growl, product, $uibModalInstance) {

        $scope.product = {};

        $scope.product = product;
        $scope.product.country = 'PL';

        var url = '/api/order-products/';

        $scope.statuses = ['OK', 'S', 'ZN'];

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
                                growl.addErrorMessage('Nie udało się dodać przesyłki!');
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