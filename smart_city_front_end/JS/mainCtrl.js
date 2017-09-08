/* For help on controllers, this website might help:
    https://www.w3schools.com/angular/angular_controllers.asp    */

scApp.controller("mainCtrl", function($scope){
    $scope.dev1 = 1;
    $scope.dev2 = 3;
    
    $scope.calculate = function(){
        $scope.calculation = $scope.dev1 + " + " + $scope.dev2 + " = " + (+$scope.dev1 + +$scope.dev2);
    }
});