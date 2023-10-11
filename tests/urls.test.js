import { expect, test } from "@jest/globals";

import { exec } from "child_process";

test("running with cli with expecting a console output", (done) => {
  const expectedOutput =
    "Couldn't download http://foozlemcblargh.com\nWrote to rithmschool.com\nWrote to nodejs.org\nWrote to postgresql.com";

  const regex = /Wrote to .+/;

  exec("node ../urls.js urls.txt", (error, stdout, stderr) => {
    // expect(stdout).toBe(expectedOutput2 + "\n");

    expect(stdout).toMatch(regex);
    // ensure that Jest waits for the asynchronous operation (exec) to finish before marking the test as complete.
    done();
  });
});
