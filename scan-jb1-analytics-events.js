#!/usr/bin/env node
// emacs mode -*-JavaScript-*-

const getopt = require('node-getopt');
const colors = require('colors');

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
let nItems = 0;
const reportItem = (item) => {
  console.log ((nItems === 0 ? '[' : ',') + JSON.stringify(item));
  ++nItems;
};
const lastItem = () => {
  if (nItems > 0)
    console.log (']');
};

let nScans = 0;
let params = {
  TableName: tableName
};
const doScan = (callback) => {
  ++nScans;
  console.warn (colors.green ('SCAN #' + nScans + ' (' + nItems + ' items)'),
		JSON.stringify (params));
  ddb.scan (params, (err, data) => {
    if (err) {
      console.warn ('Error', err);
    } else {
      data.Items.forEach (reportItem);
      if (data.LastEvaluatedKey) {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        doScan (callback);
      } else {
        callback (err, data);
      }
    }
  });
};

doScan (lastItem);
