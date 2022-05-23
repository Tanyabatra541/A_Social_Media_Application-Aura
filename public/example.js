/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    var vid=document.getElementById("background_video");
  vid.style.display="none";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    var vid=document.getElementById("background_video");
    vid.style.display="block";
  }
  function Comments() {
    var V = document.getElementById("comments");
    var T = document.getElementById("tweets");
    V.style.display = "block";
    T.style.display = "none";  // <-- Set it to block
}
function photos() {
  var V = document.getElementById("photos");
  var T = document.getElementById("tweets");
  V.style.display = "block";
  T.style.display = "none";  // <-- Set it to block
}
function Tweet() {
    var T = document.getElementById("tweets");
    var V = document.getElementById("comments");
    T.style.display = "block"; 
    V.style.display = "none"; // <-- Set it to block
}

//To check username with alphanumeric and length btw 5 to 15
function usernameValidate()
{
  var pattern=/^[a-zA-Z0-9]+$/;
  var ln = document.getElementById("username").value;
  if(pattern.test(ln)){}
  else{
    alert("Please enter a valid username");
    return false;
  }
  if ((ln.length < 5) || (ln.length > 15))
{
alert("Your Username must be 5 to 15 Character");
return false;
}
}
//To check a password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter
function CheckPassword() 
{ 
var pswd= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
var inp=document.getElementById("psw").value;
if(pswd.test(inp)) {}
else
{ 
alert("Password should contain contain at least one numeric digit, one uppercase and one lowercase letter");
return false;
}}
//phone number should contain only 10 digits
function phonenumber()
{
var phoneno = /^\d{10}$/;
var no=document.getElementById("num").value;
if(phoneno.test(no)){}
    else
      {
      alert("Number should contain only 10 digits");
      return false;
      }
}
function change() // no ';' here
{
    var elem = document.getElementById("follow");
    if (elem.value=="FOLLOW") elem.value = "FOLLOWING";
    else elem.value = "FOLLOWING";
}