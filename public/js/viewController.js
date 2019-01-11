var database = firebase.database();

angular.module('views', []);

var subreddit = window.location.hash.slice(1, 100); //Assumes that subreddits aren't longer than 100 characters

function searchSubreddit() {
  var sub = document.getElementById("searchbar").value;
  var query = sub.replace(/\s+/g, ''); //trim whitespace
  window.location.hash = '#'+query;
  window.location.reload();
}

angular.module("views")
  .component('sideBar', {
    templateUrl: 'subreddit.html',
    controller: function sideBarController($scope, $timeout) {

      this.$onInit = function() {
        if (subreddit == "") {
          var homeref = firebase.database().ref("/subreddit");
          homeref.on('value', function(snapshot) {
            $scope.$apply(function() {
              let sub = snapshot.val();
              $scope.title = sub.title;
              $scope.info = sub.info;
              $scope.rules = sub.rules;
            })
          });
        }
        else {
          var fbref = firebase.database().ref("/" + subreddit);
          fbref.on('value', function(snapshot) {
            $scope.$apply(function() {
              let sub = snapshot.val();
              if (sub != null) {
                $scope.title = sub.title;
                $scope.info = sub.info;
                $scope.rules = sub.rules;
              }
              else {
                $scope.title = "The subreddit \'" + subreddit + "\' does not exist"
                $scope.info = "Please try entering a valid subreddit name, or create this subreddit!"
                $scope.rules = "That's for you to decide."
              }

            })
          });
        }
      }
      
    }

  });


angular.
module('views').
component('postList', {
  templateUrl: 'post.html',
  controller: function PostListController($scope, $timeout) {
    $scope.posts = [];


    this.$onInit = function() {
      if (subreddit == "") {
        var fbref = firebase.database().ref('/subreddit/posts').limitToLast(10);
        fbref.on('value', function(snapshot) {
          $scope.$apply(function() {
            $scope.posts = snapshot.val();
            subreddit = 'subreddit';
          })
        }); 
      }
      else {
        var fbref = firebase.database().ref('/' + subreddit + '/posts').limitToLast(10);
        fbref.on('value', function(snapshot) {
          $scope.$apply(function() {
            $scope.posts = snapshot.val();
          })
        });
      }
    }

    $scope.upvote = function upvote(post) {
      var User = firebase.auth().currentUser;
      if (User) {
        var upRef = database.ref('/' + subreddit + '/posts/' + post.id);
        if (post.voters == undefined) { //Upvote if no voters
          post.upvotes++;
          $timeout(function() {
            upRef.update({ upvotes: post.upvotes });
            upRef.child('voters').push(User.email);
          }, 0);
        }
        else { //If there are voters
          var voterIndex = Object.keys(post.voters).find(key => post.voters[key] === User.email);
          var youVoted = voterIndex != undefined;
          if (youVoted) { //Means that the user has already voted
            post.upvotes--;
            $timeout(function() {
              upRef.update({ upvotes: post.upvotes });
              upRef.child('voters/' + voterIndex).remove();
            }, 0);
          }
          else { //The user has NOT voted
            post.upvotes++;
            $timeout(function() {
              upRef.update({ upvotes: post.upvotes });
              upRef.child('voters').push(User.email);
            }, 0);
          }
        }
      }
      else {
        alert("must login to upvote.");
      }
    }

    $scope.downvote = function downvote(post) {
      var User = firebase.auth().currentUser;
      if (User) {
        var upRef = database.ref('/' + subreddit + '/posts/' + post.id);
        if (post.downvoters == undefined) { //Downvote if no downvoters
          post.downvotes++;
          $timeout(function() {
            upRef.update({ downvotes: post.downvotes });
            upRef.child('downvoters').push(User.email);
          }, 0);
        }
        else { //If there are voters
          var voterIndex = Object.keys(post.downvoters).find(key => post.downvoters[key] === User.email);
          var youVoted = voterIndex != undefined;
          if (youVoted) { //Means that the user has already voted
            post.downvotes--;
            $timeout(function() {
              upRef.update({ downvotes: post.downvotes });
              upRef.child('downvoters/' + voterIndex).remove();
            }, 0);
          }
          else { //The user has NOT voted
            post.downvotes++;
            $timeout(function() {
              upRef.update({ downvotes: post.downvotes });
              upRef.child('downvoters').push(User.email);
            }, 0);
          }
        }
      }
      else {
        alert("must login to downvote.");
      }
    }


  }


});
// var ref = firebase.database().ref("subreddits");
// ref.orderByChild("id").equalTo(0).on("child_added", function(snapshot) {
//   console.log(snapshot.key);
// });

var myid = "";
if (localStorage) {
  if (!localStorage.getItem("sillyID")) {
    myid = "id" + Math.floor(Math.random() * 500000000);
    localStorage.setItem("sillyID", myid);
  }
  else {
    myid = localStorage.getItem("sillyID");
  }
}

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
var hours = today.getHours();
var minutes = today.getMinutes();

if (dd < 10) {
  dd = '0' + dd
}

if (mm < 10) {
  mm = '0' + mm
}
if (hours < 10) {
  hours = '0' + hours;
}
if (minutes < 10) {
  minutes = '0' + minutes;
}
var time = hours + ':' + minutes;
var today = mm + '/' + dd + '/' + yyyy;



function submitPost() {

  var User = firebase.auth().currentUser;
  if (User) {
    var ref = database.ref().child(subreddit + "/posts");
    var postText = document.getElementById("postData").value;
    var postTitle = document.getElementById("postTitle").value;
    var newPostRef = ref.push();
    var newID = newPostRef.path.pieces_[2];
    newPostRef.set({
      title: postTitle,
      content: postText,
      date: today,
      time: time,
      downvotes: 0,
      pid: 0,
      id: newID,
      upvotes: 0,
      user: User.email,
      voters: []
    });
    var modal = document.getElementById("postModalBody");
    modal.innerHTML = "You have successfully posted!"
  }
  else {
    var modal = document.getElementById("postModalBody");
    modal.innerHTML = "You must Login to Post.";
  }
}

function createSubreddit() {
  var User = firebase.auth().currentUser;
  if (User) {
    var ref = database.ref();
    var subredditText = document.getElementById("subredditData").value;
    var temp = document.getElementById("subredditTitle").value.toLowerCase();
    var subredditTitle = temp.replace(/\s+/g, ''); //trim whitespace
    var subredditRules = document.getElementById("subredditRules").value;
    ref.child(subredditTitle).set({
      title: subredditTitle,
      info: subredditText,
      id: subredditTitle,
      rules: subredditRules
    });

    //var newID = newPostRef.path.pieces_[0];
    //console.log(newPostRef);
    //console.log(newID);
    /*newPostRef.set({title: subredditTitle,
                    info: subredditText, 
                    id: newID});
    */
    var modal = document.getElementById("subredditModalBody");
    modal.innerHTML = "You have successfully created new subreddit!"
  }
  else {
    var modal = document.getElementById("subredditModalBody");
    modal.innerHTML = "You must be logged in to create a subreddit."
  }
}

// TODO: getComment method (link to database)
/*function getComment(){
  var User = firebase.auth().currentUser;
  if(User){
    var ref = database.ref().child("subreddit/posts");
  } else {
    alert("must login to post");
  }
}*/


firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    //location = "index.html";
    var loginButton = document.getElementById('LLL1');
    loginButton.innerHTML = 'Logout';
    //loginButton.removeAttribute("href");
    loginButton.setAttribute("href", "logout.html");
    document.getElementById('SS1').style.display = "none";
  }
  else {
    var loginButton = document.getElementById('LLL1');
    loginButton.removeAttribute("href");
    loginButton.setAttribute("href", "login.html");
    loginButton.innerHTML = 'Login';
    document.getElementById('SS1').style.display = "block";
  }

});