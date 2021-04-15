const fs = require('fs');

const deleteFile = filePath => {
	fs.unlink(filePath, err => {
		if (err) {
			throw new Error('Unable to delete file ' + filePath + '\n' + err);
		}
	});
};

exports.deleteFile = deleteFile;
