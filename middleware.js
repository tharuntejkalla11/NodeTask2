const GETLog = (req, res, next) => {
    console.log("GET Request");
    next();
};
const POSTLog = (req, res, next) => {
    console.log("POST Request");
    next();
};
const PUTLog = (req, res, next) => {
    console.log("PUT Request");
    next();
};
const DELETELog = (req, res, next) => {
    console.log("DELETE Request");
    next();
};

module.exports = {
    GETLog: GETLog,
    POSTLog: POSTLog,
    PUTLog: PUTLog,
    DELETELog: DELETELog
}