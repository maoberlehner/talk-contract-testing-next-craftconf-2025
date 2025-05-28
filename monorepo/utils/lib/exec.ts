import { exec as execWithCallback } from "node:child_process";

export const exec = (command: string) => {
  return new Promise((resolve, reject) => {
    execWithCallback(command, (error, stdout, stderr) => {
      if (error) {
        reject(stdout || stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};
