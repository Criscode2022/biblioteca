import { StackClientApp } from "@stackframe/react";
import { cloudConfig, isCloudConfigured } from "./config";

/**
 * The Neon Auth (Stack) client app. It is only instantiated when cloud mode is
 * configured; in offline-only builds it stays `null` and no auth code runs.
 *
 * `redirectMethod: "none"` keeps everything inside our own UI (custom sign-in /
 * register forms) so the app needs no router.
 */
export const stackClientApp = isCloudConfigured
  ? new StackClientApp({
      projectId: cloudConfig.stackProjectId!,
      publishableClientKey: cloudConfig.stackPublishableClientKey!,
      tokenStore: "cookie",
      redirectMethod: "none",
    })
  : null;
