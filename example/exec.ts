import { Ssh } from "../mod.ts";

const ssh = new Ssh({
  host: "localhost",
  port: 10022,
  username: "root",
  password: "password",
});

const decoder = new TextDecoder();
const result = await ssh.exec("ls -al");
console.log(result.status);
console.log(decoder.decode(result.stdout));
console.log(decoder.decode(result.stderr));
