const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id : 10
};

// Create token
var token = jwt.sign(data , '123abc');
console.log(`Token : \n${token}`);
// Verify token
var decoded = jwt.verify(token, '123abc');
console.log(`Decoded : ${decoded}`);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
// console.log('Message :',message);
// console.log('Hash :',hash);


// var data ={
//     id : 4
// };
// /* 
// for security issue , the 'somesecret' is a great way to make our validation STRICT for our secret only. 

// This can be if the hacker try to manipulate the Hash ID. They don't know our 'somesecret' string hash thing.
// */
// var token = {
//     data,
//     hash : SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // Try change something
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash){
//     console.log("Data was not changed");
// }else {
//     console.log("Data was changed , Do not trust !");
// }