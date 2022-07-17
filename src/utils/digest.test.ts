import { CutSite, Enzyme } from "../elements";
import digest, { findCutSites } from "./digest";

describe("Digest", () => {
  interface test {
    args: {
      enzymeList?: string[];
      enzymesCustom?: { [key: string]: Enzyme };
      seq: string;
    };
    cutSites: CutSite[];
    name: string;
  }

  const tests: test[] = [
    {
      args: {
        enzymeList: ["AatII"],
        seq: "....GACGTC....",
      },
      cutSites: [
        {
          color: "",
          direction: 1,
          end: 10,
          fcut: 9,
          id: "AatII-GACGTC-23-fwd",
          name: "AatII",
          rcut: 5,
          start: 4,
        },
        {
          color: "",
          direction: -1,
          end: 10,
          fcut: 9,
          id: "AatII-GACGTC-23-rev",
          name: "AatII",
          rcut: 5,
          start: 4,
        },
      ],
      name: "cuts with enzyme name",
    },
    {
      args: {
        enzymesCustom: {
          custom: {
            fcut: 5,
            rcut: 1,
            rseq: "GACGTC",
          },
        },
        seq: "....GACGTC....",
      },
      cutSites: [
        {
          color: "",
          direction: 1,
          end: 10,
          fcut: 9,
          id: "custom-GACGTC-23-fwd",
          name: "custom",
          rcut: 5,
          start: 4,
        },
        {
          color: "",
          direction: -1,
          end: 10,
          fcut: 9,
          id: "custom-GACGTC-23-rev",
          name: "custom",
          rcut: 5,
          start: 4,
        },
      ],
      name: "cuts with custom enzyme",
    },
    {
      args: {
        seq: "GAGACTACGACTACAG",
      },
      cutSites: [],
      name: "returns empty",
    },
    {
      args: {
        // AatII is the same enzyme as "custom"
        enzymeList: ["AatII", "AatII"],

        enzymesCustom: {
          custom: {
            fcut: 5,
            rcut: 1,
            rseq: "GACGTC",
          },
        },
        seq: "....GACGTC....",
      },
      cutSites: [
        {
          color: "",
          direction: 1,
          end: 10,
          fcut: 9,
          id: "custom-GACGTC-23-fwd",
          name: "custom",
          rcut: 5,
          start: 4,
        },
        {
          color: "",
          direction: -1,
          end: 10,
          fcut: 9,
          id: "custom-GACGTC-23-rev",
          name: "custom",
          rcut: 5,
          start: 4,
        },
      ],
      name: "dedupe enzymes",
    },
  ];

  tests.forEach(t => {
    it(t.name, () => {
      const cutSites = digest(t.args.seq, t.args.enzymeList, t.args.enzymesCustom);
      expect(cutSites).toMatchObject(t.cutSites);
    });
  });
});

describe("FindCutSites", () => {
  interface test {
    args: {
      enzyme: Enzyme;
      enzymeName: string;
      seq: string;
    };
    cutSites: CutSite[];
    name: string;
  }

  const tests: test[] = [
    {
      args: {
        enzyme: {
          color: "gray",
          fcut: 1,
          rcut: 2,
          rseq: "atgc",
        },
        enzymeName: "eco",
        seq: "....atgc....",
      },
      cutSites: [
        {
          color: "gray",
          direction: 1,
          end: 8,
          fcut: 5,
          id: "",
          name: "eco",
          rcut: 6,
          start: 4,
        },
      ],
      name: "cuts fwd",
    },
    {
      args: {
        enzyme: {
          color: "gray",
          fcut: 1,
          rcut: 2,
          rseq: "atgc",
        },
        enzymeName: "eco",
        seq: "....gcatdf....",
      },
      cutSites: [
        {
          color: "gray",
          direction: -1,
          end: 8,
          fcut: 6,
          id: "",
          name: "eco",
          rcut: 7,
          start: 4,
        },
      ],
      name: "cuts rev",
    },
    {
      args: {
        enzyme: {
          fcut: 7,
          rcut: 11,
          rseq: "GGTCTCNNNNN",
        },
        enzymeName: "BsaI",
        seq: "AAAAAGGTCTCAAAAAAAAAAAAAAAAA",
      },
      cutSites: [
        {
          color: "",
          direction: 1,
          end: 16,
          fcut: 12,
          id: "",
          name: "BsaI",
          rcut: 16,
          start: 5,
        },
      ],
      name: "cuts ambiguous match",
    },
  ];

  tests.forEach(t => {
    it(t.name, () => {
      expect(findCutSites(t.args.enzyme, t.args.seq, t.args.enzymeName)).toEqual(t.cutSites);
    });
  });
});