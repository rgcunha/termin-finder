import dotenv from "dotenv";
import path from "path";

export default function setupEnvs(): void {
  const envFile = path.resolve(__dirname, "../.env.test");
  dotenv.config({ path: envFile });
}

setupEnvs();
