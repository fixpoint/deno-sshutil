import { ConnectConfig, isConnectPasswordConfig } from "./connect.ts";

export type ExecOptions = {
  extraArgs?: string[];
  controlPersist?: number;
};

export type ExecResult = {
  status: Deno.ProcessStatus;
  stdout: Uint8Array;
  stderr: Uint8Array;
};

export type ShellOptions = {
  extraArgs?: string[];
  controlPersist?: number;
};

export type ShellResult = Deno.Process<
  Deno.RunOptions & {
    stdin: "piped";
    stdout: "piped";
    stderr: "piped";
  }
>;

export class Ssh {
  constructor(public readonly config: ConnectConfig) {}

  async exec(command: string, options: ExecOptions = {}): Promise<ExecResult> {
    const [cmd, pass] = buildCmd(this.config);
    const proc = Deno.run({
      cmd: [
        ...cmd,
        "-T",
        "-o",
        `ControlPath=~/.ssh/mux-${Deno.pid}`,
        "-o",
        "ControlMaster=auto",
        "-o",
        `ControlPersist=${options.controlPersist ?? 60}`,
        ...(options.extraArgs ?? []),
        command,
      ],
      stdin: "null",
      stdout: "piped",
      stderr: "piped",
      env: {
        ...(pass ? { SSHPASS: pass } : {}),
      },
    });
    const [status, stdout, stderr] = await Promise.all([
      proc.status(),
      proc.output(),
      proc.stderrOutput(),
    ]);
    proc.close();
    return {
      status,
      stdout,
      stderr,
    };
  }

  shell(options: ShellOptions = {}): ShellResult {
    const [cmd, pass] = buildCmd(this.config);
    const proc = Deno.run({
      cmd: [
        ...cmd,
        "-tt",
        "-o",
        `ControlPath=~/.ssh/mux-${Deno.pid}`,
        "-o",
        "ControlMaster=auto",
        "-o",
        `ControlPersist=${options.controlPersist ?? 60}`,
        ...(options.extraArgs ?? []),
        "/bin/sh",
      ],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
      env: {
        ...(pass ? { SSHPASS: pass } : {}),
      },
    });
    return proc;
  }
}

export function buildCmd(
  config: ConnectConfig,
): [string[], string | undefined] {
  const suffix = [
    ...(config.username ? ["-l", config.username] : []),
    ...(config.port ? ["-p", config.port.toString()] : []),
    config.host,
  ];
  if (isConnectPasswordConfig(config)) {
    const cmd = ["sshpass", "-e", "ssh", ...suffix];
    return [cmd, config.password];
  } else {
    if (config.passphrase) {
      const cmd = [
        "sshpass",
        "-e",
        "-P",
        "Enter passphrase for key",
        "ssh",
        "-i",
        config.privateKey,
        ...suffix,
      ];
      return [cmd, config.passphrase];
    } else {
      const cmd = ["ssh", "-i", config.privateKey, ...suffix];
      return [cmd, undefined];
    }
  }
}
