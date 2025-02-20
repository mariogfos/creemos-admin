import React from "react";
import { Card } from "@/mk/components/ui/Card/Card";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getFullName, getUrlImages } from "@/mk/utils/string";

type PropsType = {
  sponsor: any;
  isSelected?: boolean;
  onClick?: () => void;
};

const SponsorCard = ({ sponsor, isSelected, onClick }: PropsType) => {
  return (
    <Card
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
        gap: 8,
        backgroundColor: isSelected ? "var(--cSuccess)" : "var(--cBlackV1)",
        borderWidth: 0,
        cursor: "pointer",
      }}
    >
      <Avatar
        name={getFullName(sponsor)}
        src={getUrlImages(`/AFF-${sponsor?.id}.webp?d=${sponsor?.updated_at}`)}
        w={40}
        h={40}
      />
      <div
        style={{
          textAlign: "left",
          color: "var(--cWhite)",
          fontSize: "var(--sL)",
        }}
      >
        <div>
          {sponsor?.name} {sponsor?.middle_name} {sponsor?.last_name}{" "}
          {sponsor?.mother_last_name}
        </div>
        <div
          style={{
            color: "var(--cBlackV2)",
            marginTop: 4,
            fontSize: "var(--sM)",
          }}
        >
          Teléfono: {sponsor?.phone}
        </div>
      </div>
    </Card>
  );
};

export default SponsorCard;
