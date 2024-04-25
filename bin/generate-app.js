#! /usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const GIT_REPO = "https://github.com/NariP/react-template.git";

async function main() {
    try {
        console.log("Downloading files...");
        execSync(`git clone --depth 1 ${GIT_REPO} ${projectPath}`); // boiler Plate repo clone

        console.log("Installing dependencies...");
        execSync("pnpm install"); // install packages

        console.log("Removing useless files");
        execSync("npx rimraf ./.git"); // 보일러플레이트의 git과 관련된 내용 제거

        console.log("The installation is done, this is ready to use !");
    } catch (error) {
        console.log(error);
    }
}

main();