import React from "react";
import styles from "./ProgressBar.module.css";

type PropsType = {
  level: number;
  maxLevel: number;
};

const ProgressBar = ({ level, maxLevel }: PropsType) => {
  const percent = (level * 100) / maxLevel || 0;
  return (
    <div className={styles.ProgressBar}>
      <div>
        <div className={styles.Bar} style={{ width: `${percent}%` }} />
      </div>
      <div>
        {level} de {maxLevel} ({percent}% hecho)
      </div>
    </div>
  );
};

export default ProgressBar;
