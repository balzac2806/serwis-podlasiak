interMap.controller('dashboardController', ['$scope', function ($scope) {

    }]);

interMap.controller('bodyController', ['$scope', '$rootScope', '$http', '$state', '$location', 'growl', '$cookies',
    function ($scope, $rootScope, $http, $state, $location, growl, $cookies) {
        $rootScope.$state = $state;
        $scope.admin = false;

        var loginStatus = $cookies.getObject('logged');

        if (angular.isDefined($rootScope.loggedUser) || loginStatus) {
            if ($rootScope.loggedUser) {
                $scope.loggedUser = true;
            } else {
                $rootScope.permissions = {};
                $rootScope.permissions.user = loginStatus;
                $scope.loggedUser = true;
            }
        } else {
            $scope.loggedUser = false;
            $state.go('login');
        }

        angular.extend($scope, {
            logIn: function (loginForm) {
                $http({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: '/auth',
                    method: 'POST',
                    data: {
                        email: $scope.login.username,
                        password: $scope.login.password
                    }
                }).success(function (response) {
                    if (response.success) {
                        $rootScope.permissions = {};
                        $rootScope.permissions.user = response.data;
                        $rootScope.loggedUser = true;
                        $scope.loggedUser = true;
                        var expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                        $cookies.putObject('logged', response.data, {'expires': expireDate});
                        $state.go('dashboard');
                        growl.addSuccessMessage('Witaj ' + response.data.name + '!');
                    } else {
                        growl.addErrorMessage(response.error);
                    }
                });
            }
        });

        $scope.logout = function () {
            $scope.loggedUser = false;
            $rootScope.loggedUser = false;
            $cookies.remove('logged');
            $state.go('login');
            growl.addErrorMessage('Zostałeś wylogowany ! Zapraszamy ponownie !');
        }

        $scope.register = function () {
            $state.go('register');
        }

        $scope.isActive = function (state, menuState) {
            var menuActive = state.current.menuActive;
            return state.current.name == menuState || (angular.isDefined(menuActive) && menuActive == menuState);
        };

        $scope.adminMenu = function () {
            $scope.admin = !$scope.admin;
        }
    }]);


interMap.controller('registerController', ['$scope', '$rootScope', '$http', '$state', 'growl', function ($scope, $rootScope, $http, $state, growl) {
        angular.extend($scope, {
            registerIn: function (registerForm) {
                $http({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: '/register',
                    method: 'POST',
                    data:  $scope.user
                }).success(function (response) {
                    if (response.success) {
                        $state.go('login');
                        growl.addSuccessMessage('Rejestracja przebiegła pomyślnie !');
                    } else {
                        $scope.error = response.error;
                    }
                });
            }
        });
    }]);

interMap.controller('usersController', ['$scope', '$rootScope', '$http', '$state', 'growl', function ($scope, $rootScope, $http, $state, growl) {

        var url = '/api/user/';

        $scope.getUsers = function () {
            return $http.get(url);
        };

        $scope.removeUser = function (id) {
            return $http.delete(url + id);
        }

        $scope.getUsers()
                .then(function (response) {
                    if (response.data.success) {
                        $scope.users = response.data.data;
                    }
                });

        $scope.removeUsers = function (id) {
            $scope.removeUser(id).
                    success(function (data) {
                        if (data.success) {
                            angular.forEach($scope.users, function (val, key) {
                                if (val.id == id) {
                                    $scope.users.splice(key, 1);
                                }
                            });
                            growl.addSuccessMessage('Użytkownik został usunięty !');
                        } else if (data.error) {
                            growl.addErrorMessage(data.error);
                        }
                    });
        };

        $scope.editUser = function (id) {
            var params = {};
            params.userId = id;
            $state.go('editUser', params);
        };

        $scope.addUser = function () {
            $state.go('newUser');
        };

    }]);

interMap.controller('userController', ['$scope', '$stateParams', '$rootScope', '$http', '$state', 'growl', function ($scope, $stateParams, $rootScope, $http, $state, growl) {

        if (angular.isDefined($stateParams.userId)) {
            $scope.userId = $stateParams.userId;
        }

        $scope.editMode = false;
        $scope.user = {};
        $scope.roles = ['user', 'viewer', 'moderator', 'admin'];

        var url = '/api/user/';

        if (angular.isDefined($scope.userId)) {
            $scope.editMode = true;

            $http.get(url + $scope.userId)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.user = response.data.user;
                        } else {
                            growl.addErrorMessage(response.data.error);
                        }
                    });
        }

        $scope.cancel = function () {
            $state.go('users');
        };

        $scope.saveUser = function (user, editMode) {
            if (editMode) {
                return $http.put(url + $scope.user.id, user)
                        .then(function (response) {
                            if (response.data.success) {
                                growl.addSuccessMessage('Użytkownik został zaktualizowany !');
                                $state.go('users');
                            } else {
                                $scope.error = response.data.error;
                            }
                        });
            } else {
                return $http.post(url, user)
                        .then(function (response) {
                            if (response.data.success) {
                                growl.addSuccessMessage('Użytkownik został dodany !');
                                $state.go('users');
                            } else {
                                $scope.error = response.data.error;
                            }
                        });
            }
        };

        $scope.passMismatched = function () {
            if (angular.isDefined($scope.userForm)) {
                return $scope.userForm.password_confirmation.$error.match;
            }
        };

    }]);

interMap.controller('productsListController', ['$scope', '$rootScope', '$http', '$state', 'growl', '$uibModal', '$filter',
    function ($scope, $rootScope, $http, $state, growl, $uibModal, $filter) {

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


        $scope.startDate = function () {
            $scope.popup = true;
        };


        $scope.getProducts = function (sortParam, findParams) {
            return $http.get(url, {params: {sort: sortParam, find: findParams}});
        };

        $scope.search = {};

        $scope.searchProducts = function (search) {
            var find = angular.copy(search);
            if(angular.isDefined(find.date)) {
                find.date = $filter('date')(find.date, 'yyyy-MM-dd');
            }
            $scope.getProducts($scope.sort, find)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.products = response.data.data;
                            $scope.isFind = false;
                        }
                    });
        };

        $scope.clearSearch = function () {
            delete $scope.search.name;
            delete $scope.search.person;
            delete $scope.search.date;
            $scope.search = {};
            $scope.getProducts($scope.sort)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.products = response.data.data;
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

        $scope.getProducts()
                .then(function (response) {
                    if (response.data.success) {
                        $scope.products = response.data.data;
                        $scope.sort = 'name';
                    }
                });

        $scope.addProduct = function () {
            var modalInstance = $uibModal.open({
                templateUrl: '/front/views/products-list/components/modal/product.tpl.html',
                controller: 'productModalController',
                resolve: {
                    product: function () {
                        return {
                        };
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $state.go($state.current, {}, {reload: true});
                growl.addSuccessMessage('Produkt został dodany pomyślnie !');
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
interMap.controller('returnsListController', ['$scope', '$rootScope', '$http', '$state', 'growl', '$uibModal', '$filter',
    function ($scope, $rootScope, $http, $state, growl, $uibModal, $filter) {

        $scope.sortType = 'created_at';
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
//# sourceMappingURL=controllers.js.map
