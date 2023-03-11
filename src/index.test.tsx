import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";

import * as React from "react";

import { SeqViz } from ".";
import demoPart from "./demoPart";

const props = {
  annotations: [
    {
      end: 10,
      name: "ann_1",
      start: 0,
    },
  ],
  name: "test_part",
  seq: "ATGGTAGTTAGATAGGGATACCGATAGACTTGAGAGATACCGCATCTATTTACGACCAGCGAGCAG",
  testSize: { height: 600, width: 800 },
};

describe("SeqViz rendering (React)", () => {
  afterEach(() => cleanup());

  it("renders", () => {
    const { getAllByTestId } = render(<SeqViz {...props} />);
    expect(getAllByTestId("la-vz-seqviz")).toBeTruthy();
    expect(getAllByTestId("la-vz-viewer-container")).toHaveLength(1);

    // renders full sequence
    const seqs = getAllByTestId("la-vz-seq");
    const seq = seqs.map(s => s.textContent).join("");
    expect(seq).toEqual(props.seq);
  });

  it("renders with linear viewer only", () => {
    const { getAllByTestId, getByTestId } = render(<SeqViz {...props} viewer="linear" />);
    expect(getAllByTestId("la-vz-seqviz")).toBeTruthy();

    expect(getByTestId("la-vz-viewer-linear")).toBeTruthy();
    expect(getAllByTestId("la-vz-viewer-linear")).toHaveLength(1);
  });

  it("renders with circular viewer only", () => {
    const { getAllByTestId, getByTestId } = render(<SeqViz {...props} viewer="circular" />);
    expect(getAllByTestId("la-vz-seqviz")).toBeTruthy();

    expect(getByTestId("la-vz-viewer-circular")).toBeTruthy();
    expect(getAllByTestId("la-vz-viewer-circular")).toHaveLength(1);
  });

  it("renders with Genbank file string input", async () => {
    render(<SeqViz {...props} file={demoPart} />);
    expect(screen.getAllByTestId("la-vz-seqviz")).toBeTruthy();

    expect(screen.getAllByTestId("la-vz-viewer-container")).toHaveLength(1);

    // Verify the file's sequence is rendered.
    // The linear viewer will cut off the end, this is just the prefix
    const seqs = screen.getAllByTestId("la-vz-seq");
    const seq = seqs.map(s => s.textContent).join("");
    expect(seq).toContain("ttgacagctagctcagtcctaggtactgtgctagcta");
  });

  it("renders with an Amino Acid sequence", () => {
    const aaSeq =
      "MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTFSYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITHGMDELYK*";

    const { getAllByTestId, getByTestId } = render(<SeqViz {...props} seq={aaSeq} seqType="aa" viewer="linear" />);
    expect(getAllByTestId("la-vz-seqviz")).toBeTruthy();
    expect(getByTestId("la-vz-viewer-linear")).toBeTruthy();
    expect(getAllByTestId("la-vz-viewer-linear")).toHaveLength(1);

    // const seqs = getAllByTestId("la-vz-translation");
    // const seq = seqs.map(s => s.textContent).join("");
    // expect(seq).toEqual(aaSeq);
  });

  it("renders with an externally set Selection prop", () => {
    const { getAllByTestId } = render(
      <SeqViz
        {...props}
        selection={{ end: 15, start: 1 }}
        seq="MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTFSYGVQCFSRYPDHMKQHDRAEVK"
        viewer="linear"
      />
    );
    expect(getAllByTestId("la-vz-seqviz")).toBeTruthy();
    expect(getAllByTestId("la-vz-selection-block")).toBeTruthy();
    expect(getAllByTestId("la-vz-selection-edge")).toHaveLength(1);
  });
});
