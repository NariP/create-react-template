#! /usr/bin/env node
const { execSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");


const {isDirectoryEmpty, clearDirectory, removeDirectory} = require("../src/utils/fileSystems")
const {getUserInput} = require("../src/utils/inputs")


let projectName = ''
const currentPath = process.cwd();

const getProjectName = async () => {
		projectName = await getUserInput('Please enter your project name (or "." for current directory): ');
}


const GIT_REPO = "https://github.com/NariP/react-template.git";

/**
	* 별도로 존재하는 리액트 보일러플레이트 레포 인스톨
	* @param {string} currentPath
	* @param {string} projectName
	*/
const fetchBoilerplate = ({currentPath, projectName}) => {
		 console.log("Downloading files...");
		const projectPath = path.join(currentPath, projectName);
		execSync(`git archive --remote=${GIT_REPO} HEAD | tar -x -C ${projectPath}`);
		console.log(`Successfully cloned the repository to ${projectPath}`);

		// .git 폴더 경로
		const gitFolderPath = path.join(projectPath, '.git');
		removeDirectory(gitFolderPath)
}

const copyBoilerplate = ({currentPath, projectName}) => {
		console.log("Copying boilerplate files...");

		const tempDir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'boilerplate-'));

		try {
				// Clone boilerplate to temp directory
				execSync(`git archive --remote=${GIT_REPO} HEAD | tar -x -C "${tempDir}"`);

				// Remove .git folder from cloned boilerplate
				fs.rmSync(path.join(tempDir, '.git'), { recursive: true, force: true });

				const targetPath = path.join(currentPath, projectName);
				// Copy all files from temp directory to target path, excluding .git if it exists
				const copyCommand = process.platform === 'win32'
						? `xcopy /E /I /H /Y "${tempDir}" "${targetPath}" /EXCLUDE:${path.join(tempDir, '.git')}`
						: `cp -a ${tempDir}/. ${targetPath}`;

				execSync(copyCommand);

				console.log(`Successfully copied boilerplate to ${targetPath}`);
		} finally {
				// Clean up temp directory
				fs.rmSync(tempDir, { recursive: true, force: true });
		}
}

/**
	* 디펜던시 설치
	*/
const installDependencies = () => {
		console.log("Installing dependencies...");
		execSync("pnpm install");
}

const main = async () => {
		try {
				// 1. Project Name 을 입력 받는다.
				await getProjectName();

				// 2. 현재 currentPath 의 디렉토리가 비어있는지 확인
				const isEmpty = isDirectoryEmpty(process.cwd());

				// 3. 비어있지 않으면 디렉토리 내 파일들을 삭제할건지 물어보기
				if(!isEmpty) {
						console.log('The directory is not empty.');
						const answer = await getUserInput('Would you like to clear the directory? (Y/N): ');
						if (answer.toUpperCase() === 'Y') {
								clearDirectory(currentPath);
						} else {
								throw Error('Cannot proceed further as the directory is not empty (.git 제외).')
						}
				}


				// 4. 이제 비어있는 상태이기 때문에 git repo clone & 보일러플레이트의 .git 폴더 제거
				copyBoilerplate({currentPath, projectName});

				// fetchBoilerplate({currentPath, projectName});

				// 5. install dependencies
				installDependencies();

				console.log('The end!')
		} catch (e) {
				console.log(e)
		}
}

main();
