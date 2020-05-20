const keys = require("./keys");

const express = require("express");
const bodyParser = require("body-parser")

const app = express();
app.use(bodyParser.json());

const redis = require("redis");
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () => console.log('No connection to PG DB'));

pgClient.query('CREATE TABLE IF NOT EXISTS results_wa(number REAL)').catch(err => console.log(err));

console.log(keys);

weight_average = function (numbers, weights) {
    let sum_weights = 0;
    let sum_multiplication = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum_multiplication += numbers[i] * weights[i];
        sum_weights += weights[i];
    }
    return sum_multiplication / sum_weights;
};


app.get("/count-average/", (req, resp) => {
    const key = `${req.query.numbers}&${req.query.weights}`;
    const numbers = req.query.numbers.split(';').map(Number);
    const weights = req.query.weights.split(';').map(Number);
    numbers.pop();
    weights.pop();
    console.log(numbers,weights)

    if (numbers.length > weights.length){
        return resp.send({error: "Not all numbers have weights"});
    }

    if (numbers.length < weights.length){
        return resp.send({error: "Too many weights"});
    }

    if (numbers.length === 0 || weights.length === 0) {
        return resp.send({error: "Please provide numbers and weights"});
    }    

    if (numbers.some(isNaN) || weights.some(isNaN)) {
        return resp.send({error: "Please provide only digits"});
    }

    redisClient.get(key, (err, weighted_average) => {
        if(!weighted_average) {
            weighted_average = weight_average(numbers, weights);
            redisClient.set(key, weighted_average);
        }
        console.log(key,weighted_average)
        pgClient.query('INSERT INTO results_wa(number) VALUES ($1)', [weighted_average]).catch(err => console.log(err));
        resp.send({result: weighted_average})
    });

});

app.listen(4000, err => {
    console.log("Server listening on port 4000");
});

