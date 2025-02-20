import React, { CSSProperties } from "react";
import styles from "../Activities.module.css";

type PropsType = {
  title?: string;
  children: any;
  style?: CSSProperties;
};

const CardActivityView = ({ title, children, style }: PropsType) => {
  return (
    <div className={styles.CardActivy} style={style}>
      {title && <p>{title}</p>}
      <div>{children}</div>
    </div>
  );
};

export default CardActivityView;
