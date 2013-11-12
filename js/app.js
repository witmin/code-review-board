/**
 * Created by millie.lin on 11/12/13.
 */
var app = angular.module("codeReviewBoard", ["firebase"]);

function MainController($scope, angularFire ){
    var ref = new Firebase("https://code-review-firebase.firebaseio.com/");
//  Set up review item
    $scope.item = [];
    angularFire(ref, $scope, "item");

//  Date
    $scope.date = new Date();

//  Add
    $scope.addReviewItem = function(e){
        if(e.keyCode != 13) return;
        $scope.item.push({
            coderName: $scope.coderName,
            description: $scope.description,
            status: 'waiting',
            createdTime : $scope.date,
            reviewer: ''
            })
        $scope.description = '';
    };
    $scope.addReviewItemClick = function(){
        $scope.item.push({
            coderName: $scope.coderName,
            description: $scope.description,
            status: 'waiting',
            reviewer: ''
        })
        $scope.description = '';
    };

//Remove
    $scope.removeReviewItem = function(index){
        $scope.item.splice(index, 1);
    };
}