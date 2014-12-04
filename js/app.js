/**
 * Created by millie.lin on 11/12/13.
 */

(function(){
    var app = angular.module("codeReviewBoard", ["firebase"]);

    app.controller("ReviewController", ["$scope", "$firebase",
        function($scope, $firebase){
            var ref = new Firebase('https://code-review-firebase.firebaseio.com/reviews');

            // create an AngularFire reference to the data
            var sync = $firebase(ref);

            // download the data into a local object
            $scope.reviews = sync.$asArray();

            // Add Review Request
            $scope.addReviewRequest = function(requester, desc) {
                var createdOn = moment().calendar();
                $scope.reviews.$add({
                    description: desc,
                    requester: requester,
                    createdTime: createdOn,
                    status: 'waiting',
                    reviewer: '(To be claimed)',
                    'startReviewTime': ' ',
                    'endReviewTime': ' '
                });
            };

    }]);

    app.controller("ReviewerController", function () {
        var date = moment().calendar();
        this.reviewer = {};
        this.addReviewer= function(e){
            var keys = e.reviews.$getIndex();
            keys.forEach(function(key, i){
                console.log(i, e.items[key]);
                ref.key.$update({
                    "reviewerName" : this.reviewer.reviewerName,
                    "startReviewTime" : date
                });
            });

            this.reviewer = {};
        };
    });

    // Show/hide Reviewer Dialog
    var reviewerDialog = {'show': false};

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
})();