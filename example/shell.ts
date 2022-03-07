import { Receiver, Sender } from "https://deno.land/x/replutil@v0.0.2/mod.ts";
import { Ssh } from "../mod.ts";

const ssh = new Ssh({
  host: "localhost",
  port: 10022,
  username: "root",
  password: "password",
});

const proc = ssh.shell();
const prompt = /.*[#\$] $/;
const sender = new Sender(proc.stdin);
const receiver = new Receiver(proc.stdout);

await receiver.wait(prompt);
await sender.send("ls -al\n");
console.log("-".repeat(80));
console.log(await receiver.recv(prompt));
console.log("-".repeat(80));

await sender.send("export HELLO=world\n");
await receiver.wait(prompt);

await sender.send("echo $HELLO\n");
console.log("-".repeat(80));
console.log(await receiver.recv(prompt));
console.log("-".repeat(80));
