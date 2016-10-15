var interMap = angular.module('interMap', ['ngRoute', 'ngCookies', 'ui.router', 'angular-growl', 'ui.bootstrap', 'pascalprecht.translate', 
    'ui.select', 'ngSanitize']);

interMap.config(['growlProvider', function (growlProvider) {
        growlProvider.globalTimeToLive(5000);
    }]);

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

