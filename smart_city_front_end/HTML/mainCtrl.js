/* For help on controllers, this website might help:
    https://www.w3schools.com/angular/angular_controllers.asp    */

function mainCtrl($scope){
    $scope.username = "uname";
    $scope.password = "pw";
    $scope.descript = "This is the description";
    
    $scope.editText = function(){
        return $scope.descript;
    };
}

scApp.controller("mainCtrl", mainCtrl);