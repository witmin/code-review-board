/**
 * Created by millie.lin on 11/12/13.
 */
var app = angular.module("codeReviewBoard", ["firebase"]);

function MainController($scope, angularFire ){
    var ref = new Firebase('https://code-review-firebase.firebaseio.com/');
//  Set up review item
    $scope.item = [];
    angularFire(ref, $scope, "item");

//  Get Date and Time through moment.js
    $scope.date = moment().calendar();

//  Coder is the user who post the review request
    $scope.coderName = '';
    $scope.reviewerName = '';

//  Add
    $scope.addReviewItem = function(e){
        if(e.keyCode != 13) return;
        $scope.item.push({
            user: $scope.coderName,
            description: $scope.description,
            status: 'waiting',
            createdTime : $scope.date,
            reviewer: '',
            startReviewTime: '',
            endReviewTime:''
            });
        pushAddNotify(ref);
        $scope.description = '';
    };
    $scope.addReviewItemClick = function(){
        $scope.item.push({
            user: $scope.coderName,
            description: $scope.description,
            status: 'waiting',
            reviewer: '',
            startReviewTime: '',
            endReviewTime:''
        });
        pushAddNotify(ref);
        $scope.description = '';
    };

//  Remove
    $scope.removeItem = function() {
        $scope.item.splice($scope.toRemove, 1);
        $scope.toRemove = null;
    };


//  Click "Start Review" to add reviewer's name and to change status
    $scope.startReviewClick = function(index){
        ref.index.update({
            reviewer: $scope.reviewerName,
            status: 'under review'
        });
    };
}
//    Show Webkit Notification When new database comes in
function pushAddNotify(db){
    db.on('child_added', function(snapshot){
        var userName = snapshot.val().user;
        var content = snapshot.val().description;
        addNotify(userName, content);
    });
}
//Webkit Notification
function addNotify(user, description) {
    var havePermission = window.webkitNotifications.checkPermission();
    if (havePermission == 0) {
        // 0 is PERMISSION_ALLOWED
        var notification = window.webkitNotifications.createNotification(
            'images/notification-new.png',
            user + ' needs code review',
            description
        );

        notification.onclick = function () {
            window.open("index.html");
            notification.close();
        }
        notification.show();
    } else {
        window.webkitNotifications.requestPermission();
    }
}