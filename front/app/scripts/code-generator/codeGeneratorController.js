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
