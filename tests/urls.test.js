import { expect, test } from "@jest/globals";

import { exec } from "child_process";

test("running with cli with expecting a console output", (done) => {
  const regex1 = /.*Success: .+/;
  const regex2 = /.*nodsdf1111asfejs.org.+/;

  exec("node ./src/fetchdata.js urls.txt", (error, stdout, stderr) => {
    expect(stdout).toMatch(regex1);
    expect(stdout).toMatch(regex2);
    // ensure that Jest waits for the asynchronous operation (exec) to finish before marking the test as complete.
    done();
  });
}, 10000);
