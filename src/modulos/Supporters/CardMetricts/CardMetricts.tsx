import React from "react";

interface Props {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const CardMetricts = ({ label, value, icon }: Props) => {
  return (
    <div
      style={{
        backgroundColor: "var(--cBlackV1)",
        display: "flex",
        width: "100%",
        padding: 12,
        borderRadius: 8,
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ color: "var(--cBlackV2)" }}>{label}</p>
        <p
          style={{
            color: "var(--cWhite)",
            fontWeight: 700,
            marginTop: 8,
            fontSize: 20,
          }}
        >
          {value}
        </p>
      </div>
      <div>{icon}</div>
    </div>
  );
};

export default CardMetricts;
