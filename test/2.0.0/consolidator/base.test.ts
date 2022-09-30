import { Consolidator } from "../../../src/rmrk2.0.0";
import {
  createBaseMock,
  createBaseMock2,
  getBlockCallsMock,
  getRemarksFromBlocksMock,
} from "../mocks";
import { cryptoWaitReady } from "@polkadot/util-crypto";

beforeAll(async () => {
  return await cryptoWaitReady();
});

describe("rmrk2.0.0 Consolidator: CREATE BASE", () => {
  it("should correctly create a Base", async () => {
    const remarks = getRemarksFromBlocksMock(
      getBlockCallsMock(createBaseMock().base())
    );
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should prevent creating a Base with duplicate part ids", async () => {
    const remarks = getRemarksFromBlocksMock(
      getBlockCallsMock(createBaseMock2().base())
    );
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });
});
