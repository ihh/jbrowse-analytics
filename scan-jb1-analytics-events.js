#!/usr/bin/env node
// emacs mode -*-JavaScript-*-

const getopt = require('node-getopt');

// AWS info
const tableName = 'JB1_Analytics_Events';
const region = 'us-east-1';

const AWS = require('aws-sdk');
AWS.config.update ({ region: region });

var opt = getopt.create([
  ['h' , 'help'          , 'display this help message']
])              // create Getopt instance
    .bindHelp()     // bind option 'help' to default action
    .parseSystem() // parse command line

// Create DynamoDB service object
const ddb = new AWS.DynamoDB();

// Do DynamoDB SCAN
const params = {
  TableName: tableName
};
console.warn ('SCAN', JSON.stringify (params));

ddb.scan (params, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    //console.log("Success", data.Items);
    data.Items.forEach(function(element, index, array) {
      console.log (element);
    });
  }
});
