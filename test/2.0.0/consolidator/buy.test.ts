import { Consolidator } from "../../../src/rmrk2.0.0";
import {
  createCollectionMock,
  getAliceKey,
  getBlockCallsMock,
  getBobKey,
  getRemarksFromBlocksMock,
  mintNftMock, mintNftMock2, mintNftMock3,
} from "../mocks";
import { cryptoWaitReady } from "@polkadot/util-crypto";

beforeAll(async () => {
  return await cryptoWaitReady();
});

describe("rmrk2.0.0 Consolidator: BUY", () => {
  const getSetupRemarks = () => [
    ...getBlockCallsMock(createCollectionMock().create()),
    ...getBlockCallsMock(mintNftMock().mint()),
  ];

  it("Should allow you to BUY listed NFT for yourself", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(mintNftMock(3).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should allow you to BUY listed NFT for someone else", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(mintNftMock(3).list(BigInt(1e12))),
      ...getBlockCallsMock(
        mintNftMock(3).buy("5Cafn1kueAGQnrcvN2uHFQ5NaMznSMyrfeUzuDHDQsMRSsN6"),
        getBobKey().address,
        [
          {
            call: "balances.transfer",
            value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
            caller: getBobKey().address,
          },
        ]
      ),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should prevent you from BUYing unlisted NFT", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should prevent you from BUYing non existent NFT", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should prevent you from BUYing burned NFT", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(mintNftMock(3).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock(3).burn()),
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should prevent you from BUYing NFT without a balance transfer", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(mintNftMock(3).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should prevent you from BUYing NFT with incorrect balance transfer", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(mintNftMock(3).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(2e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should prevent you from BUYing child NFT with incorrect balance transfer", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(mintNftMock2().mint(mintNftMock(3).getId())),
      ...getBlockCallsMock(mintNftMock2(4).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(2e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should correctly change rootowner of all child NFTs", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(mintNftMock2().mint(mintNftMock(3).getId())),
      ...getBlockCallsMock(mintNftMock3().mint(mintNftMock2(4).getId())),
      ...getBlockCallsMock(mintNftMock(3).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should correctly change rootowner when child NFT is sold", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(mintNftMock2().mint(mintNftMock(3).getId())),
      ...getBlockCallsMock(mintNftMock3().mint(mintNftMock2(4).getId())),
      ...getBlockCallsMock(mintNftMock3(5).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock3(5).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });

  it("Should correctly save changes when commission is paid", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getSetupRemarks(),
      ...getBlockCallsMock(mintNftMock2().mint(mintNftMock(3).getId())),
      ...getBlockCallsMock(mintNftMock3().mint(mintNftMock2(4).getId())),
      ...getBlockCallsMock(mintNftMock3(5).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock3(5).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
          caller: getBobKey().address,
        },
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(0.1e12).toString()}`,
          caller: getAliceKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });
  
  it("Should prevent BUYing NFT after transferable block passed with negative transfer value", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getBlockCallsMock(createCollectionMock().create()),
      ...getBlockCallsMock(mintNftMock(0, { transferable: -1 }).mint()),
      ...getBlockCallsMock(mintNftMock(3).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks);
    expect((await consolidator.getResults()).invalid[0].message).toEqual(
      "[BUY] Attempting to BUY non-transferable NFT 3-d43593c715a56da27d-KANARIABIRDS-KANR-00000777. It was transferable until block 4 but tx made at block 5"
    );
  });
  
  it("Should allow BUYing NFT if transferable block not passed with negative transfer value", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getBlockCallsMock(createCollectionMock().create()),
      ...getBlockCallsMock(mintNftMock(0, { transferable: -4 }).mint()),
      ...getBlockCallsMock(mintNftMock(3).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });
  
  it("Should allow BUYing NFT after transferable block reached with positive transfer value", async () => {
    const remarks = getRemarksFromBlocksMock([
      ...getBlockCallsMock(createCollectionMock().create()),
      ...getBlockCallsMock(mintNftMock(0, { transferable: 3 }).mint()),
      ...getBlockCallsMock(mintNftMock(3).list(BigInt(1e12))),
      ...getBlockCallsMock(mintNftMock(3).buy(), getBobKey().address, [
        {
          call: "balances.transfer",
          value: `${getAliceKey().address},${BigInt(1e12).toString()}`,
          caller: getBobKey().address,
        },
      ]),
    ]);
    const consolidator = new Consolidator();
    await consolidator.consolidate(remarks)
    const consolidatedResult = await consolidator.getResults()
    expect(consolidatedResult).toMatchSnapshot();
  });
});
