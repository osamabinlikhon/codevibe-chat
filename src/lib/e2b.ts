import { Sandbox } from "@e2b/code-interpreter";

let sandbox: Sandbox | null = null;

export async function getSandbox() {
  if (!sandbox) {
    const apiKey = process.env.E2B_API_KEY;
    if (!apiKey) {
      throw new Error("E2B_API_KEY is not set in environment variables");
    }
    sandbox = await Sandbox.create({
      apiKey,
    });
  }
  return sandbox;
}

export async function closeSandbox(): Promise<void> {
  if (sandbox) {
    await sandbox.kill();
    sandbox = null;
  }
}
