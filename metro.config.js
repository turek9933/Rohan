// Thanks to https://github.com/expo/expo/issues/36588
// Stupid SDK 53

const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs');

defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
