import { cStatusAc, statusAc } from "@/mk/utils/utils";
import React from "react";
type PropsType = {
  state: string;
};

const StateLabel = ({ state }: PropsType) => {
  return (
    <p
      // font-size: 12px;
      // font-weight: 500;
      // padding: 4px 8px;
      // color: var(--cWhiteV1);
      // background-color: var(--cBlackV2);
      // border-radius: 50px;
      style={{
        backgroundColor: cStatusAc[state],
        borderRadius: "50px",
        color: "var(--cWhiteV1)",
        fontSize: "12px",
        fontWeight: 500,
        padding: "4px 8px",
      }}
    >
      {statusAc[state]}
    </p>
  );
};

export default StateLabel;
