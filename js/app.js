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
        notify($scope.coderName, $scope.description);
        $scope.description = '';
    };
    $scope.addReviewItemClick = function(){
        $scope.item.push({
            coderName: $scope.coderName,
            description: $scope.description,
            status: 'waiting',
            reviewer: ''
        })
        notify($scope.coderName, $scope.description);
        $scope.description = '';
    };

//Remove
    $scope.removeReviewItem = function(index){
        $scope.item.splice(index, 1);
    };
}

//Webkit Notificatiion
function notify(coderName, description) {
    var havePermission = window.webkitNotifications.checkPermission();
    if (havePermission == 0) {
        // 0 is PERMISSION_ALLOWED
        var notification = window.webkitNotifications.createNotification(
            'images/notification-new.png',
            coderName + ' asks for Code Review',
            'About '+ description
        );

        notification.onclick = function () {
            window.open("http://stackoverflow.com/a/13328397/1269037");
            notification.close();
        }
        notification.show();
    } else {
        window.webkitNotifications.requestPermission();
    }
}