var env = process.env.NODE_ENV || 'development'; // Only in Heroku

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    // to avoid wiping our original database
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}