const errorMessageTemplates = {};

errorMessageTemplates.general = {};

errorMessageTemplates.general.serverSideError = function (error) {
	if (!error) return 'some error occured on server side.';

	return error;
};

module.exports = errorMessageTemplates;
