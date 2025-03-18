import React from "react";
import styles from "./WidgetBase.module.css";

type PropsType = {
  title: string;
  children: any;
  className?: any;
};

const WidgetBase = ({ title, children, className }: PropsType) => {
  return (
    <div className={styles.WidgetBase + " " + className}>
      <p>{title}</p>
      {children}
    </div>
  );
};

export default WidgetBase;
