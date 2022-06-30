const express = require("express");
const JOI = require("joi");

const router = express.Router();
const users = require("./DB/UserData.js").users;
//let users = [];
const { GETLog, POSTLog, PUTLog, DELETELog } = require("./middleware");

const getusers = (req, res) => {
    //console.log(users);
    //res.send({ message: "The selection Query is Successfull!!", Users: users.filter(user => !user.isDeleted) });
    res.send(users);
    //res.json(users);
};

const getuserwithId = (req, res) => {
    const requserId = req.params.UserId;
    const Requser = users.find((user) => user.id === requserId);
    console.log(Requser);
    if (Requser != null) {
        res.send({ message: "The User Exists!!", User: Requser });
    } else {
        res.send({ message: "The User doesn't Exists!!" });
    }
};

const getAutoSuggestUsers = (req, res) => {
    const loginSubstring = req.params.loginSubstring;
    const limit = req.params.limit;

    const Sortedusers = users.sort((a, b) => a.login.localeCompare(b.login));
    const suggestedUsers = Sortedusers.filter(
        (user) => user.login.indexof(loginSubstring) != -1
    ).slice(0, limit);
    res.statusCode = 200;
    res.send({ message: "The Suggested Users", Users: suggestedUsers });
};

const createUser = (req, res) => {
    const newUser = req.body;
    const isvalid = isValiduser(newUser);
    if (
        !isvalid.error &&
        users.findIndex((user) => user.id == newUser.id) == -1
    ) {
        console.log(newUser);
        users.push(newUser);
        res.send({ message: "The User Added successfully!!", User: users });
    } else {
        let Errormessage = "User Already Exists";
        if (isvalid.error) Errormessage = isvalid.error.message;
        res.send({ message: Errormessage });
    }
};

const updateUserwithId = (req, res) => {
    const requserId = req.params.userId;
    const newUserDetails = req.body;
    const Position = users.findIndex((user) => user.id === requserId);
    const isvalid = isValiduser(newUserDetails);

    if (Position == -1) {
        res.send({ message: "Unable to locate the User." });
    } else if (!isvalid.error) {
        //console.log(newUserDetails);
        users[Position] = newUserDetails;
        res.send({ message: "Successfully updated the User details. " });
    } else {
        res.send({ message: isvalid.error.message });
    }
};

const deleteUserwithId = (req, res) => {
    const requserId = req.params.userId;
    const userToBeDeleted = users.find(
        (user) => user.id == requserId && user.isDeleted === false
    );

    if (userToBeDeleted != null) {
        //undefined
        userToBeDeleted.isDeleted = true;
        res.send({ message: "sucessfully DeletedaUser", users: users });
    } else {
        res.send({
            message: "Unable to locate the user to Delete.",
            users: users,
        });
    }
};

const forAnyotherRequest = (req, res) => {
    throw new Error(
        `the requested resource page is not available - ${req.originalUrl}`
    );
};

router.use("/getusers", GETLog, getusers);
router.use("/getuser/:UserId", GETLog, getuserwithId);
router.use(
    "/getAutoSuggestUsers/:loginSubstring/:limit",
    GETLog,
    getAutoSuggestUsers
);
router.use("/createUser", POSTLog, createUser);
router.use("/updateUser/:userId", PUTLog, updateUserwithId);
router.use("/deleteUser/:userId", DELETELog, deleteUserwithId);
router.use("/*", forAnyotherRequest);

module.exports = {
    Router: router,
};

/* function isValiduser(userDetails, haduser){ */
function isValiduser(userDetails) {
    const UserSchema = JOI.object({
        id: JOI.string().required().trim(true),
        login: JOI.string().required().min(1).max(20).trim(true),
        password: JOI.string().required().trim(true).min(6).alphanum(),
        age: JOI.number().integer().min(4).max(130).required(),
        isDeleted: JOI.boolean().required(),
    }).options({ abortEarly: false });

    return UserSchema.validate(userDetails);
}
