#! /usr/bin/env node
const fs = require("node:fs");

/**
 * directoryPath 가 비어있는지 여부를 반환하는 함수
 * @param {string} directoryPath 검사할 파일 경로
 * @returns {boolean}
 */
const isDirectoryEmpty = (directoryPath) => {
    try {
        const files = fs.readdirSync(directoryPath);
        console.log(directoryPath,files,files.length)
        if(files.length <= 0) {
            return true;
        }

        return files.length === 1 && files[0] === '.git';
    } catch (err) {
        console.error("Error reading directory:", err);
        return false;
    }
}

const removeDirectory = (directoryPath) => {
    fs.rmSync(directoryPath, { recursive: true, force: true });
}

const clearDirectory = (directoryPath) => {
    // 디렉토리 삭제
    removeDirectory(directoryPath)
    console.log(`기존 디렉토리를 삭제했습니다: ${directoryPath}`);

    // 디렉토리 다시 생성
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`새 디렉토리를 생성했습니다: ${directoryPath}`);
}

module.exports = {
    isDirectoryEmpty,
    removeDirectory,
    clearDirectory
}

