import React, { CSSProperties } from "react";
import styles from "./AddTask.module.css";

type PropsType = {
  children: any;
  title?: string;
  subtitle?: string;
  style?: CSSProperties;
  styleSubtitle?: CSSProperties;
};

const CardTask = ({
  children,
  title,
  subtitle,
  style,
  styleSubtitle,
}: PropsType) => {
  return (
    <div className={styles.CardTask} style={style}>
      <div>
        <p>{title}</p>
        {subtitle && <p style={styleSubtitle}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

export default CardTask;
