type ConnectBareConfig = {
  readonly host: string;
  readonly port?: number;
  readonly username?: string;
};

type ConnectPasswordConfig = ConnectBareConfig & {
  readonly password: string;
};

type ConnectPrivateKeyConfig = ConnectBareConfig & {
  readonly privateKey: string;
  readonly passphrase?: string;
};

export type ConnectConfig = ConnectPasswordConfig | ConnectPrivateKeyConfig;

export function isConnectPasswordConfig(
  config: ConnectConfig,
): config is ConnectPasswordConfig {
  // deno-lint-ignore no-explicit-any
  const value = config as any;
  return !!value.password;
}

export function isConnectPrivateKeyConfig(
  config: ConnectConfig,
): config is ConnectPrivateKeyConfig {
  // deno-lint-ignore no-explicit-any
  const value = config as any;
  return !!value.privateKey;
}
