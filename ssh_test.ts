import { assertEquals } from "./deps_test.ts";
import { buildCmd } from "./ssh.ts";

Deno.test("buildCmd", async (t) => {
  await t.step("returns proper result for password config", async (t) => {
    await t.step("without", () => {
      const [cmd, pass] = buildCmd({
        host: "localhost",
        password: "password",
      });
      assertEquals(cmd, ["sshpass", "-e", "ssh", "localhost"]);
      assertEquals(pass, "password");
    });
    await t.step("with port", () => {
      const [cmd, pass] = buildCmd({
        host: "localhost",
        port: 22,
        password: "password",
      });
      assertEquals(cmd, ["sshpass", "-e", "ssh", "-p", "22", "localhost"]);
      assertEquals(pass, "password");
    });
    await t.step("with username", () => {
      const [cmd, pass] = buildCmd({
        host: "localhost",
        username: "john",
        password: "password",
      });
      assertEquals(cmd, ["sshpass", "-e", "ssh", "-l", "john", "localhost"]);
      assertEquals(pass, "password");
    });
    await t.step("with port and username", () => {
      const [cmd, pass] = buildCmd({
        host: "localhost",
        port: 22,
        username: "john",
        password: "password",
      });
      assertEquals(cmd, [
        "sshpass",
        "-e",
        "ssh",
        "-l",
        "john",
        "-p",
        "22",
        "localhost",
      ]);
      assertEquals(pass, "password");
    });
  });

  await t.step(
    "returns proper result for private key config (without passphrase)",
    async (t) => {
      await t.step("without", () => {
        const [cmd, pass] = buildCmd({
          host: "localhost",
          privateKey: "/home/john/.ssh/id_rsa",
        });
        assertEquals(cmd, ["ssh", "-i", "/home/john/.ssh/id_rsa", "localhost"]);
        assertEquals(pass, undefined);
      });
      await t.step("with port", () => {
        const [cmd, pass] = buildCmd({
          host: "localhost",
          port: 22,
          privateKey: "/home/john/.ssh/id_rsa",
        });
        assertEquals(cmd, [
          "ssh",
          "-i",
          "/home/john/.ssh/id_rsa",
          "-p",
          "22",
          "localhost",
        ]);
        assertEquals(pass, undefined);
      });
      await t.step("with username", () => {
        const [cmd, pass] = buildCmd({
          host: "localhost",
          username: "john",
          privateKey: "/home/john/.ssh/id_rsa",
        });
        assertEquals(cmd, [
          "ssh",
          "-i",
          "/home/john/.ssh/id_rsa",
          "-l",
          "john",
          "localhost",
        ]);
        assertEquals(pass, undefined);
      });
      await t.step("with port and username", () => {
        const [cmd, pass] = buildCmd({
          host: "localhost",
          port: 22,
          username: "john",
          privateKey: "/home/john/.ssh/id_rsa",
        });
        assertEquals(cmd, [
          "ssh",
          "-i",
          "/home/john/.ssh/id_rsa",
          "-l",
          "john",
          "-p",
          "22",
          "localhost",
        ]);
        assertEquals(pass, undefined);
      });
    },
  );

  await t.step(
    "returns proper result for private key config (with passphrase)",
    async (t) => {
      await t.step("without", () => {
        const [cmd, pass] = buildCmd({
          host: "localhost",
          privateKey: "/home/john/.ssh/id_rsa",
          passphrase: "password",
        });
        assertEquals(cmd, [
          "sshpass",
          "-e",
          "-P",
          "Enter passphrase for key",
          "ssh",
          "-i",
          "/home/john/.ssh/id_rsa",
          "localhost",
        ]);
        assertEquals(pass, "password");
      });
      await t.step("with port", () => {
        const [cmd, pass] = buildCmd({
          host: "localhost",
          port: 22,
          privateKey: "/home/john/.ssh/id_rsa",
          passphrase: "password",
        });
        assertEquals(cmd, [
          "sshpass",
          "-e",
          "-P",
          "Enter passphrase for key",
          "ssh",
          "-i",
          "/home/john/.ssh/id_rsa",
          "-p",
          "22",
          "localhost",
        ]);
        assertEquals(pass, "password");
      });
      await t.step("with username", () => {
        const [cmd, pass] = buildCmd({
          host: "localhost",
          username: "john",
          privateKey: "/home/john/.ssh/id_rsa",
          passphrase: "password",
        });
        assertEquals(cmd, [
          "sshpass",
          "-e",
          "-P",
          "Enter passphrase for key",
          "ssh",
          "-i",
          "/home/john/.ssh/id_rsa",
          "-l",
          "john",
          "localhost",
        ]);
        assertEquals(pass, "password");
      });
      await t.step("with port and username", () => {
        const [cmd, pass] = buildCmd({
          host: "localhost",
          port: 22,
          username: "john",
          privateKey: "/home/john/.ssh/id_rsa",
          passphrase: "password",
        });
        assertEquals(cmd, [
          "sshpass",
          "-e",
          "-P",
          "Enter passphrase for key",
          "ssh",
          "-i",
          "/home/john/.ssh/id_rsa",
          "-l",
          "john",
          "-p",
          "22",
          "localhost",
        ]);
        assertEquals(pass, "password");
      });
    },
  );
});
