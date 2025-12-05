import { timeLeft } from "../../pages/voter/PollList.jsx";

describe("timeLeft()", () => {
  test("returns 'Expired' when date is past", () => {
    const oldDate = new Date(Date.now() - 10000).toISOString();
    expect(timeLeft(oldDate)).toBe("Expired");
  });

  test("returns days left correctly", () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const result = timeLeft(futureDate);
    expect(result).toBe("1 day left");
  });
});
