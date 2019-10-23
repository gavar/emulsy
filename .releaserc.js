/** @type {WsConfiguration} */
const config = {
  ...require("@wrench/semantic-release-ws-preset-nodejs/default"),
  reduceReleaseType: "patch",
};

config.workspace = {
  ...config.workspace,
};

config.workspace = {
  ...config.workspace,
};

module.exports = config;
