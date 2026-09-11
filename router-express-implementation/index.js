const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/posts.js");
const cookieParser = require("cookie-parser");

// app.use(cookieParser());
app.use(cookieParser("secretcode"));

app.use("/users", users);
app.use("/posts", posts);

app.get("/setCookies", (req, res) => {
  res.cookie("name", "smita");
  res.cookie("user", "Revan");
  res.send("some cookie sent");
});

app.get("/getCookies", (req, res) => {
  let { user = "anonymous" } = req.cookies;
  res.send(`Welocome ${user}`);
});

//signedcookies
app.get("/setSignedCookie",(req,res)=>{
  res.cookie("color","red",{signed:true});
  res.send("signed cookie sent")
});

app.get("/verify",(req,res)=>{
  let signedCookie=req.signedCookies;
  let {name,user}=req.cookies;
 console.log(signedCookie);
 console.log(name);
 console.log(user);
})
app.listen(3000, () => {
  console.log("server listning at port no 3000");
});
