var database = firebase.database();
  
//angular.module('')
/*var submit = document.getElementById("submit");
if(submit!="null"){
submit.addEventListener("click",loginUser);
}*/

//window.onload=function(){
function loginUser(){ //CREATE
    var user = document.getElementById('inputEmail1').value;
    var password = document.getElementById('inputPassword1').value;
    document.getElementById('inputPassword1').value = "";
    if (password.length < 4) {
      alert('Please enter a valid password.');
      return;
    }
    firebase.auth().signInWithEmailAndPassword(user, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert("Incorrect Username or Password");
      }else{
        alert(errorMessage);
      }
    });
  }
  
  function googleAuth(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }
  
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
    location = "index.html";
    console.log("logged in");
    //var loginButton = document.getElementById('LLL1');
    //console.log(loginButton.innerHTML);
    //loginButton.removeAttribute("href");
    //loginButton.setAttribute("onclick",logout());
    //loginButton.innerHTML = 'Logout';
    /*var loginButton2 = document.getElementById('LLL2');
    console.log(loginButton2.innerHTML);
    loginButton2.removeAttribute("href");
    loginButton2.setAttribute("onclick",logout());
    loginButton2.innerHTML = 'Logout';*/
    //var loginButton3 = document.getElementById('LLL3');
    //console.log(loginButton3.innerHTML);
    //loginButton3.removeAttribute("href");
    //loginButton3.setAttribute("onclick",logout());
    //loginButton3.innerHTML = 'Logout';
    //document.getElementById('loggedin').style.display = "initial";
    //document.getElementById('namestuff').style.display = "none";
  } else{
    /*var loginButton = document.getElementById('LLL2');
    loginButton.removeAttribute("onclick");
    loginButton.setAttribute("href","login.html");
    loginButton.innerHTML = 'Login';*/
    console.log("logged out");
  }  
    // No user is signed in.
    //location = "index.html"
    //document.getElementById('loggedin').style.display = "none";
    //document.getElementById('namestuff').style.display = "initial";
  //}
});

function logout(){
    console.log("logout");
    firebase.auth().signOut().then(function() {
      console.log("logout successful")
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Incorrect Username or Password");
    });
  }
//}