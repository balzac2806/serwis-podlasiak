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
            if (angular.isDefined(find.date)) {
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
                backdrop: 'static',
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
interMap.controller('orderProductsListController', ['$scope', '$rootScope', '$http', '$state', 'growl', '$uibModal', '$filter', '$stateParams',
    function ($scope, $rootScope, $http, $state, growl, $uibModal, $filter, $stateParams) {

        $scope.sortType = 'id';
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
            $scope.product.editor = $rootScope.permissions.user.name;
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
            $scope.correction.adder = $rootScope.permissions.user.name;
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
interMap.controller('providersListController', ['$scope', '$rootScope', '$http', '$state', 'growl', '$uibModal', '$filter',
    function ($scope, $rootScope, $http, $state, growl, $uibModal, $filter) {

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


        $scope.getProviders = function (sortParam, findParams) {
            return $http.get(url, {params: {sort: sortParam, find: findParams}});
        };

        $scope.search = {};

        $scope.searchProviders = function (search) {
            var find = angular.copy(search);
            if (angular.isDefined(find.date)) {
                find.date = $filter('date')(find.date, 'yyyy-MM-dd');
            }
            $scope.getProviders($scope.sort, find)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.providers = response.data.data;
                            $scope.isFind = false;
                        }
                    });
        };

        $scope.clearSearch = function () {
            delete $scope.search.name;
            delete $scope.search.date;
            $scope.search = {};
            $scope.getProviders($scope.sort)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.providers = response.data.data;
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

        $scope.getProviders()
                .then(function (response) {
                    if (response.data.success) {
                        $scope.providers = response.data.data;
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
                $scope.getProviders(newVal)
                        .then(function (response) {
                            if (response.data.success) {
                                $scope.providers = response.data.data;
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
            delete $scope.search.cost;
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
                    || angular.isDefined($scope.search.cost)
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
        $scope.moneyReturn.time = new Date();

        var url = '/api/money-returns/';

        if (angular.isDefined($scope.returnId)) {
            $scope.editMode = true;

            $http.get(url + $scope.returnId)
                    .then(function (response) {
                        if (response.data.success) {
                            $scope.moneyReturn = response.data.data;
                            if (angular.isDefined($scope.moneyReturn.date)) {
                                $scope.moneyReturn.date = new Date($scope.moneyReturn.date);
                                $scope.moneyReturn.time = new Date($scope.moneyReturn.time);
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
        $scope.moneyReturn.time = new Date();
        $scope.moneyReturn.person = $rootScope.permissions.user.name;

        if (angular.isDefined(moneyReturn.subiect)) {
            $scope.returnId = moneyReturn.id;
            $scope.moneyReturn = moneyReturn;
            $scope.moneyReturn.time = new Date($scope.moneyReturn.time);
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
interMap.controller('codeGeneratorController', ['$scope', '$http',
    function ($scope, $http) {

        var url = '/api/code-generator/';

        $scope.getCodeGeneratorData = function () {
            return $http.get(url);
        };

        $scope.html = [];
        $scope.draft = {
            product_name: '',
            product_description: '',
            product_description_two: '',
            product_description_three: '',
            product_image_first: '',
            product_image_second: '',
            product_image_third: '',
            product_image_four: '',
            product_image_five: '',
            product_image_six: '',
            product_image_seven: '',
            product_image_eight: '',
            product_image_nine: ''
        };

        $scope.getCodeGeneratorData()
                .then(function (response) {
                    if (response.data.success) {
                        $scope.templates = response.data.templates;
                        $scope.template_elements = response.data.template_elements;
                        $scope.template_htmls = response.data.template_htmls;
                        $scope.html = angular.copy($scope.template_htmls);
                    }
                });

        $scope.generate = function (draft, template) {
            var html = angular.copy($scope.html[template]);
            var elements = angular.copy($scope.template_elements[template]);
            angular.forEach(draft, function (value, key) {
                angular.forEach(elements, function (v, k) {
                    if (v.key == key) {
                        if (value == '') {
                            value = '';
                        } else {
                            value = v.shortcode.replace('[' + key + ']', value);
                        }
                        html = html.replace(v.shortcode, value);
                    }
                });
            });
            $scope.template_htmls[template] = angular.copy(html);
        };
    }]);

//# sourceMappingURL=controllers.js.map
