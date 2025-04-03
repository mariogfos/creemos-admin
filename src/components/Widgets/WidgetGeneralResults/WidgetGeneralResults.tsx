import React, { CSSProperties } from "react";
import styles from "./WidgetGeneralResults.module.css";

type PropsType = {
  text: string;
  icon?: any;
  value: any;
  styleValue?: CSSProperties;
};

const WidgetGeneralResults = ({ text, icon, value, styleValue }: PropsType) => {
  return (
    <div className={styles.WidgetGeneralResults}>
      {icon && <div>{icon}</div>}
      <p className={styles.text}>{text}</p>
      <p className={styles.value} style={styleValue}>
        {value}
      </p>
    </div>
  );
};

export default WidgetGeneralResults;
