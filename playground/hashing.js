const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

// Create token
// var token = jwt.sign(data , '123abc');
// console.log(`Token : \n${token}`);
// Verify token
// var decoded = jwt.verify(token, '123abc');
// console.log(`Decoded : ${decoded}`);

var hashedPassword = '$2a$10$SYQASQTdy.UIRCjzpp1eGOwU7vkrxt4HCedZ6z2llW066jKZTseyK';

bcrypt.compare(password , hashedPassword , (err , result)=>{
    console.log(result);
});

// var data = {
//     id : 10
// };

// // Create token
// var token = jwt.sign(data , '123abc');
// console.log(`Token : \n${token}`);
// // Verify token
// var decoded = jwt.verify(token, '123abc');
// console.log(`Decoded : ${decoded}`);

/* ---------------------------------------------------- */
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



// Bcrypt hashing password
var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
    // first argument -> the password data
    // second argument -> salt params pass
    // Thir argument -> callback function
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
        /* Output example :
        $2a$10$P8JM7W816OmEw2IkYXzRu.ZKryi9nB82xlJaEOoevvkU85sA0J67q
        */
    });
});

// Validate hashing
var hashedPassword = '$2a$10$SYQASQTdy.UIRCjzpp1eGOwU7vkrxt4HCedZ6z2llW066jKZTseyK';

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result); // true
});