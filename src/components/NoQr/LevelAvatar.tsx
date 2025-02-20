import React from "react";
import { IconLevel } from "../layout/icons/IconsBiblioteca";

type PropsType = {
  level: string;
  size?: number;
  style?:any;
};

const LevelAvatar = ({ level ,size = 32 ,style }: PropsType) => {
  return (
    <section
      style={{
        position: "absolute",
        bottom: -16,
        justifyContent: "center",
        display: "flex",
        ...style
      }}
    >
      <IconLevel viewBox="0 0 30 30" color="var(--cAccent)" size={size} />
      <p
        style={{
          position: "absolute",
          top: 4,
          color: "var(--cWhite)",
          fontWeight: 600,
        }}
      >
        {level}
      </p>
    </section>
  );
};

export default LevelAvatar;
