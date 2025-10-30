export const environments = {
  dev: {
    akademia: "https://akademia.gwodev.pl",
    moje: "https://moje.gwodev.pl",
  },
  prod: {
    akademia: "https://akademia.gwo.pl",
    moje: "https://moje.gwo.pl",
  },
};

export function getEnvironment() {
  const env = process.env.ENVIRONMENT || "dev";
  return environments[env as keyof typeof environments];
}
