var env = process.env.NODE_ENV || 'development'; // Only in Heroku

if(env === 'development' || env === 'test')
{
    var config = require('./config.json');
    // console.log(config);
    var envConfig = config[env];

    // Object.keys() is getting object keys , and return them to Array
    // console.log(Object.keys(envConfig));

    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
    });
}