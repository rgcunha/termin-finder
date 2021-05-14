import "jest-extended";
import createLogger from "../logger";

describe("createLogger", () => {
  it("returns a new logger", () => {
    const logger = createLogger();

    expect(logger).not.toBeEmpty();
    expect(logger.error).toBeFunction();
  });
});
