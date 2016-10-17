var interMap = angular.module('interMap', ['ngRoute', 'ngCookies', 'ui.router', 'angular-growl', 'ui.bootstrap', 'pascalprecht.translate',
    'ui.select', 'ngSanitize']);

interMap.config(['growlProvider', function (growlProvider) {
        growlProvider.globalTimeToLive(5000);
    }]);

angular.isDefinedNotNull = function (val) {
    return angular.isDefined(val) && val !== null;
};

interMap.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
                // Logowanie
                .state('login', {
                    url: "/login",
                })
                // Rejestracja
                .state('register', {
                    url: "/register",
                    templateUrl: "front/views/register/register.tpl.html",
                    controller: 'registerController',
                })
                // Dashboard
                .state('dashboard', {
                    url: "/dashboard",
                    templateUrl: "front/views/dashboard/dashboard.tpl.html",
                    controller: 'dashboardController',
                })
                // Lista - Brakujące Towary
                .state('productsList', {
                    url: "/products/list",
                    templateUrl: "front/views/products-list/products.tpl.html",
                    controller: 'productsListController',
                })
                // Widok - Brakujące Towary
                .state('productView', {
                    url: "/products/:productId",
                    templateUrl: "front/views/products-list/product.tpl.html",
                    controller: 'productPageController',
                })
                // Lista - Zwroty
                .state('returnsList', {
                    url: "/returns/list",
                    templateUrl: "front/views/returns-list/returns.tpl.html",
                    controller: 'returnsListController',
                })
                // Widok - Zwroty
                .state('returnView', {
                    url: "/returns/:returnId",
                    templateUrl: "front/views/returns-list/return.tpl.html",
                    controller: 'returnPageController',
                })
                // Lista - Zwroty - Produkty
                .state('orderProductsList', {
                    url: "/returns/orders/list/:returnId",
                    templateUrl: "front/views/returns-list/order/products.tpl.html",
                    controller: 'orderProductsListController',
                })
                // Widok - Zwroty - Produkty
                .state('orderProductView', {
                    url: "/returns/orders/:productId",
                    templateUrl: "front/views/returns-list/order/product.tpl.html",
                    controller: 'orderProductPageController',
                })
                // Użytkownicy - Administracja
                .state('users', {
                    url: "/users",
                    templateUrl: "front/views/users/users.tpl.html",
                    controller: 'usersController',
                })
                .state('newUser', {
                    url: "/user",
                    templateUrl: "front/views/users/user.tpl.html",
                    controller: 'userController',
                })
                .state('editUser', {
                    url: "/user/:userId",
                    templateUrl: "front/views/users/user.tpl.html",
                    controller: 'userController',
                })
    }]);

interMap.directive('ngReallyClick', ['$uibModal', function ($uibModal) {
    return {
        restrict: 'A',
        scope: {
            ngReallyHeader: '@',
            ngReallyMessage: '@',
            ngReallyClick: '&'
        },
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                var header = scope.ngReallyHeader;
                var message = scope.ngReallyMessage;
                var modalInstance = $uibModal.open({
                    templateUrl: 'front/views/components/modal/confirmDialog.tpl.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.ok = function () {
                            $uibModalInstance.close(true);
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };

                        $scope.header = header || 'MODAL.CONFIRM.HEADER';
                        $scope.message = message || 'MODAL.CONFIRM.MSG';
                    }
                });

                modalInstance.result.then(function (isConfirmed) {
                    if (isConfirmed) {
                        scope.ngReallyClick();
                    }
                });
            });
        }
    }
}]);

interMap.directive('modalClose', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: false,
        controller: function ($scope) {
            $scope.close = function () {
                $scope.$uibModal.dismiss('cancel');
            };
        },
        template: '<div class=\"modal-close\"><i class=\"li-close\" ng-click=\"close()\"></i></div>'
    }
});
//# sourceMappingURL=app.js.map
