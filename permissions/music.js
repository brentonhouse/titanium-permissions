/* eslint-disable promise/avoid-new */
const logger = require(`@geek/logger`).createLogger(`@titanium/permissions`, { meta: { filename: __filename } });

const permissionName = `music`;
logger.trace(`📍  entering → permissions/${permissionName}`);
const events = require(`events`).default;


const permission = {};
module.exports = permission;

// TIBUG: Major issue as code fails to compile when using music permissions -- https://jira.appcelerator.org/browse/TIMOB-23674

// permission.check = () => {
// 	logger.trace(`📍  entering → ${permissionName}.check()`);
// 	//TIBUG: Major issue as code fails to compile with this line in the code -- https://jira.appcelerator.org/browse/TIMOB-23674
// 	return OS_IOS ? Titanium.Media.hasMusicLibraryPermissions() : true;
// };

// permission.ensure = () => {
// 	logger.trace(`📍  entering → ${permissionName}.ensure()`);
// 	return new Promise(
// 		(resolve, reject) => {
// 			const hasPermission = permission.check();

// 			if (hasPermission) {
// 				return resolve();
// 			} else {
// 				// don't use arrow function or we lose access to this.event

// 				events.on(`permissions::${permissionName}::accepted`, function handlePermissions(e, args) {
// 					logger.debug(`${permissionName} permission accepted!`);
// 					events.off(`permissions::${permissionName}::accepted`, handlePermissions);
// 					return resolve();
// 				});

// 				events.on(`permissions::${permissionName}::rejected`, function handlePermissions(e, args) {
// 					logger.debug(`${permissionName} permission rejected!`);
// 					events.off(`permissions::${permissionName}::rejected`, handlePermissions);
// 					return reject(Error('Permission rejected'));
// 				});

// 				events.on(`permissions::${permissionName}::ignored`, function handlePermissions(e, args) {
// 					logger.debug(`${permissionName} permission ignored!`);
// 					events.off(`permissions::${permissionName}::ignored`, handlePermissions);
// 					Alloy.open('permission-ignored', { permission: permissionName });
// 				});

// 				permission.please();

// 			}
// 		});
// };

// permission.please = () => {
// 	logger.trace(`📍  entering → ${permissionName}.please()`);
// 	Alloy.close('permission-ignored');
// 	Alloy.open(`permission-${permissionName}`);
// };

// permission.ignore = () => {
// 	logger.trace(`📍  entering → ${permissionName}.ignore()`);
// 	Alloy.close(`permission-${permissionName}`);
// 	events.fire(`permissions::${permissionName}::ignored`);
// };

// permission.reject = () => {
// 	logger.trace(`📍  entering → ${permissionName}.reject()`);
// 	Alloy.close(`permission-${permissionName}`);
// 	Alloy.close('permission-ignored');
// 	events.fire(`permissions::${permissionName}::rejected`);
// };

// permission.prompt = () => {
// 	logger.trace(`📍  entering → ${permissionName}.prompt()`);
// 	return permission.native()
// 		.then(success => {
// 			logger.debug(`native ${permissionName} permission success: ${JSON.stringify(success, null, 2)}`);
// 			if (!success) {
// 				logger.debug(`emitting event → permissions::${permissionName}::rejected`);
// 				events.emit(`permissions::${permissionName}::rejected`);
// 			} else {
// 				logger.debug(`emitting event → permissions::${permissionName}::accepted`);
// 				events.emit(`permissions::${permissionName}::accepted`);
// 			}
// 		})
// 		.then(() => {
// 			Alloy.close(`permission-${permissionName}`);
// 		});


// };


// permission.native = () => {
// 	logger.trace(`📍  entering → ${permissionName}.native()`);
// 	return new Promise(
// 		(resolve, reject) => {

// 			const callback = e => {
// 				logger.trace(`📍  entering → ${permissionName}.native().callback`);
// 				resolve(e.success);
// 			};
// 			Ti.Media.requestMusicLibraryPermissions(callback);
// 		});
// };


