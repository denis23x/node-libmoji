'use strict'
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const download = async url => {
	const filename = Date.now() + '.png';
	const stream = fs.createWriteStream(path.resolve('public/avatars', filename));
	const response = await axios({ url, method: 'GET', responseType: 'stream'	});

	response.data.pipe(stream);

	return new Promise((resolve, reject) => {
		stream.on('finish', () => resolve(filename));
		stream.on('error', error => reject(error));
	});
};

module.exports = {
	download
};
