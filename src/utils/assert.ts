export const assert: (condition: unknown, msg?: string) => asserts condition = (condition, msg) => {
  if (!condition) {
    throw new Error(msg);
  }
};
