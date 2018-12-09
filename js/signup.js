var database = firebase.database();
  
//angular.module('')
/*var submit = document.getElementById("submit");
if(submit!="null"){
submit.addEventListener("click",loginUser);
}*/
//window.onload = function(){
function register(){
  var user = document.getElementById('inputEmail2').value;
  var password = document.getElementById('inputPassword2').value;
  document.getElementById('inputPassword2').value = user;
  if (password.length < 4) {
    alert('Please enter a password with more than 4 characters.');
    return;
  }
  firebase.auth().createUserWithEmailAndPassword(user, password)
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    // ...
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log("logged in");
    var loginButton = document.getElementById('LLL3');
    loginButton.innerHTML = 'Logout';
    loginButton.setAttribute("href","logout.html");
    location = "index.html";
  } else{
    var loginButton = document.getElementById('LLL3');
    //loginButton.removeAttribute("onclick");
    loginButton.setAttribute("href","login.html");
    loginButton.innerHTML = 'Login';
    console.log("logged out");
  }  
    // No user is signed in.
    //location = "index.html"
    //document.getElementById('loggedin').style.display = "none";
    //document.getElementById('namestuff').style.display = "initial";
  //}
});