import { Consolidator } from "../../../src/rmrk2.0.0";
import {
  createBaseMock,
  createCollectionMock,
  getAliceKey,
  getBlockCallsMock,
  getBobKey,
  getRemarksFromBlocksMock,
  mintNftMock,
  mintNftMock2,
} from "../mocks";
import { cryptoWaitReady } from "@polkadot/util-crypto";

beforeAll(async () => {
  return await cryptoWaitReady();
});

describe("rmrk2.0.0 Consolidator: CHANGEISSUER", () => {
  const getSetupRemarks = () => [
    ...getBlockCallsMock(createCollectionMock().create()),
    ...getBlockCallsMock(mintNftMock().mint()),
  ];

  it("Should allow to CHANGEISSUER of collection", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(
        createCollectionMock(2).change_issuer(getBobKey().address)
      ),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should allow to CHANGEISSUER of base", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getBlockCallsMock(createBaseMock().base()),
      ...getBlockCallsMock(
        createBaseMock(2).change_issuer(getBobKey().address)
      ),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should prevent from CHANGEISSUER of non-existent base or collection", async () => {
    const consolidator = new Consolidator();
    await consolidator.consolidate(
      getRemarksFromBlocksMock([
        ...getBlockCallsMock(
          createBaseMock(3).change_issuer(getBobKey().address)
        ),
      ])
    )
    expect(
      await consolidator.getResults()
    ).toMatchSnapshot();

      await consolidator.consolidate(
        getRemarksFromBlocksMock([
          ...getBlockCallsMock(
            createCollectionMock(3).change_issuer(getBobKey().address)
          ),
        ])
      )
    expect(
      await consolidator.getResults()
    ).toMatchSnapshot();
  });

  it("Should prevent to CHANGEISSUER of non-owned collection", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getBlockCallsMock(createCollectionMock().create()),
      ...getBlockCallsMock(
        createCollectionMock(2).change_issuer(getBobKey().address),
        getBobKey().address
      ),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });
});
