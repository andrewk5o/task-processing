
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'andrewk5o',
  applicationName: 'task-processing',
  appUid: 'fWVrLq7M0jppR2ssVh',
  orgUid: '89b643ef-0e63-40f6-8b92-5e6cd7c189b4',
  deploymentUid: 'ebe36383-6eff-42da-8ab2-cb3411c67276',
  serviceName: 'task-processing',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '7.2.3',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'task-processing-dev-taskProcessor', timeout: 6 };

try {
  const userHandler = require('./apps/backend/functions/taskProcessor/index.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}