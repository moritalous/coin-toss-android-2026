const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const javaHome = process.env.JAVA_HOME;

if (!javaHome) {
  throw new Error("JAVA_HOME is not set. Run this script through `mise exec --`.");
}

const javaBin = path.join(javaHome, "bin", process.platform === "win32" ? "java.exe" : "java");

if (!fs.existsSync(javaBin)) {
  throw new Error(`JAVA_HOME does not look like a JDK path: ${javaHome}`);
}

const configDir = path.join(os.homedir(), ".bubblewrap");
const configPath = path.join(configDir, "config.json");
let config = {};

if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, "utf8"));
}

config.jdkPath = javaHome;

fs.mkdirSync(configDir, { recursive: true });
fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

console.log(`Bubblewrap JDK path set to: ${javaHome}`);
