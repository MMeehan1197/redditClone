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
    
  } else{
    location = "index.html";
  }  
    // No user is signed in.
    //location = "index.html"
    //document.getElementById('loggedin').style.display = "none";
    //document.getElementById('namestuff').style.display = "initial";
  //}
});

window.onload = function(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Incorrect Username or Password");
    });
  };
//}