import React, { CSSProperties } from "react";
import styles from "../Activities.module.css";

type PropsType = {
  children: any;
  title?: string;
  subtitle?: string;
  style?: CSSProperties;
  styleSubtitle?: CSSProperties;
};

const CardActivity = ({
  children,
  title,
  subtitle,
  style,
  styleSubtitle,
}: PropsType) => {
  return (
    <div className={styles.CardActivity} style={style}>
      <div>
        <p>{title}</p>
        {subtitle && <p style={styleSubtitle}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

export default CardActivity;
