const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const response = await fetch('https://api.zynlepay.com/jsonapi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    return {
        statusCode: response.status,
        body: JSON.stringify(data)
    };
};
