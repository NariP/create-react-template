#! /usr/bin/env node

const readline = require('node:readline');
const {stdin: input, stdout: output} = require('node:process');


/**
	* 질문을 하고 input을 Return 하는 Promise 함수
	*
	* @param {string} question 질문
	* @param {string=} errorMessage 에러메세지
	* @returns {Promise<string>}
	*/
const getUserInput = (question, errorMessage) => {
		const rl = readline.createInterface({input, output})

		return new Promise((resolve) => {
				rl.question(question, (input) => {
						if(typeof input === 'string' && !input) {
								throw Error(errorMessage || 'Please Write more than one word.')
						}
						resolve(input)
						rl.close();
				})
		})
}

module.exports = {
		getUserInput
}
