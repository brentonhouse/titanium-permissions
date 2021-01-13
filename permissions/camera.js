/* eslint-disable promise/avoid-new */
const logger = require(`@geek/logger`).createLogger(`@titanium/permissions`, { meta: { filename: __filename } });

const permissionName = `camera`;
logger.trace(`📍  entering → permissions/${permissionName}`);
const events = require(`events`).default;

const permission = {};
module.exports = permission;

permission.check = () => {
	logger.trace(`📍  entering → ${permissionName}.check()`);
	// Ti.Media.CAMERA_AUTHORIZATION_AUTHORIZED;
	// Ti.Media.CAMERA_AUTHORIZATION_DENIED;
	// Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED;
	// Ti.Media.CAMERA_AUTHORIZATION_UNKNOWN;

	// return Ti.Media.cameraAuthorization === Ti.Media.CAMERA_AUTHORIZATION_AUTHORIZED;

	return Ti.Media.hasCameraPermissions();
};


permission.ensure = () => {
	logger.trace(`📍  entering → ${permissionName}.ensure()`);
	return new Promise((resolve, reject) => {
		const hasPermission = permission.check();

		if (hasPermission) {
			return resolve(true);
		} else {
			// don't use arrow function or we lose access to this.event


			events.once(`permissions::${permissionName}::accepted`, (e, args) => {
				logger.debug(`${permissionName} permission accepted!`);
				// events.off(`permissions::${permissionName}::accepted`, handlePermissions);
				return resolve(true);
			});

			events.on(`permissions::${permissionName}::rejected`, (e, args) => {
				logger.debug(`${permissionName} permission rejected!`);
				// events.off(`permissions::${permissionName}::rejected`, handlePermissions);
				return reject(Error(`Permission rejected: ${permissionName}`));
				// resolve(false);
			});

			events.on(`permissions::${permissionName}::ignored`, (e, args) => {
				logger.debug(`${permissionName} permission ignored!`);
				// events.off(`permissions::${permissionName}::ignored`, handlePermissions);
				Alloy.open(`permission-ignored`, { permission: permissionName });
			});

			permission.please();

		}
	});
};

permission.please = () => {
	logger.trace(`📍  entering → ${permissionName}.please()`);
	Alloy.close(`permission-ignored`);
	Alloy.open(`permission-${permissionName}`);
};

permission.ignore = () => {
	logger.trace(`📍  entering → ${permissionName}.ignore()`);
	Alloy.close(`permission-${permissionName}`);
	events.fire(`permissions::${permissionName}::ignored`);
};

permission.reject = () => {
	logger.trace(`📍  entering → ${permissionName}.reject()`);
	Alloy.close(`permission-${permissionName}`);
	Alloy.close(`permission-ignored`);
	events.fire(`permissions::${permissionName}::rejected`);
};

permission.prompt = () => {
	logger.trace(`📍  entering → ${permissionName}.prompt()`);
	return permission.native()
		.then(success => {
			logger.debug(`native ${permissionName} permission success: ${JSON.stringify(success, null, 2)}`);
			if (!success) {
				logger.debug(`emitting event → permissions::${permissionName}::rejected`);
				events.emit(`permissions::${permissionName}::rejected`);
			} else {
				logger.debug(`emitting event → permissions::${permissionName}::accepted`);
				events.emit(`permissions::${permissionName}::accepted`);
			}
		})
		.then(() => {
			Alloy.close(`permission-${permissionName}`);
		});


};


permission.native = () => {
	logger.trace(`📍  entering → ${permissionName}.native()`);
	return new Promise(
		(resolve, reject) => {

			const callback = e => {
				logger.trace(`📍  entering → ${permissionName}.native().callback`);
				resolve(e.success);
			};

			// OS_ANDROID is processed before this file is read so we need to use alternate function
			// if (OS_ANDROID) {
			if (Titanium.App.android) {
				const androidPermissions = [ `android.permission.CAMERA`, `android.permission.READ_EXTERNAL_STORAGE`, `android.permission.WRITE_EXTERNAL_STORAGE` ];
				Ti.Android.requestPermissions(androidPermissions, callback);
			// } else if (OS_IOS) {
			} else if (Titanium.App.iOS) {
				Ti.Media.requestCameraPermissions(callback);
			} else {
				console.error(`Unknown OS - processing as successful`);
				callback({  success: true });
			}
		});
};


