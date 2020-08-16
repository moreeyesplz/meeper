const core = require('@actions/core');
const github = require('@actions/github');

const context_payload = JSON.stringify(github.context.payload, undefined, 2);
console.log(`Context payload: ${context_payload}`);

const event_payload = JSON.stringify(github.event, undefined, 2);
console.log(`Context payload: ${event_payload}`);