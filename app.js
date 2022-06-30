const express = require("express");
const PORT = process.env.PORT || 4000;

const users = require("./DB/UserData").users;
const router = require("./routecontroller").Router;
const app = express();
app.use(express.json());
app.use("/", router);

var bodyParser = require("body-parser");

/* console.log("nope");
console.log(users); */
/* 
app.use((err, req, res, next) => { //To handle Errors
    if (err) {
        res.json({ msg: ` Some Error has Occured: ${err.message} ` });
    }
    next();
}); */

app.listen(PORT, () => {
    console.log(`The Express Server is running on port: ${PORT}.can access by visiting http://localhost:${PORT}
                    /getusers -> to display all users
                    /getuser/Id -> to display userdetails with given ID
                    /createUser -> to createanew user
                    /getAutoSuggestUsers/:loginSubstring/:limit -> to autosuggest user
                    /updateUser/userId -> to update user
                    /deleteUser/userId -> to delete user
                    /* `);
});
