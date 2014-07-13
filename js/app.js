/**
 * Created by millie.lin on 11/12/13.
 */

(function(){
    var app = angular.module("codeReviewBoard", ["firebase"]);

    var ref = new Firebase('https://code-review-firebase.firebaseio.com/reviews');

    
    app.controller("ReviewController", function($firebase){
        this.reviews = [];
        this.reviews = $firebase(ref);
        this.removeReview = function(){
            ref.remove();
        };

    //    this.startReviewClick = startReviewClick;
    });

    app.controller("RequestController", function(){
        // Get Date and Time through moment.js
        var date = moment().calendar();
        this.review = {};
        this.review = {
            'status': 'waiting',
            'createdTime': date,
            'reviewer': '(To be confirmed)',
            'startReviewTime': ' ',
            'endReviewTime': ' '
        };
        this.addRequest= function(){
            ref.push(this.review);
            this.review = {};
        };
    });

    app.controller("ReviewerController", function () {
        var date = moment().calendar();
        this.reviewer = {};
        this.addReviewer= function(){
            ref.child().set({
                "reviewerName": this.reviewer.reviewerName,
                "startReviewTime": date
            });
            this.reviewer = {};
        };
    });
    
    // Show/hide Reviewer Dialog
    var reviewerDialog = {
        'show': false
    }

    //  Add
    var addReviewItem = function(e){
        if(e.keyCode != 13) return;
        reviews.push({
            user: $scope.coderName,
            description: $scope.description,
            status: 'waiting',
            createdTime : new date(),
            reviewer: '',
            startReviewTime: '',
            endReviewTime:''
        });
        pushAddNotify(reviews);
//        description = '';
    };

    //  Remove
    var removeItem = function() {
        reviews.splice(this.toRemove, 1);
        this.toRemove = null;
    };

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
})()