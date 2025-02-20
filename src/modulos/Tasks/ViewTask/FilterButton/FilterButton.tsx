import React, { CSSProperties } from "react";
import styles from "./FilterButton.module.css";

type PropsType = {
  sel: string;
  values: { value: string; name: string; badge?: any }[];
  setSel: any;
  style?: CSSProperties;
};

const FilterButton = ({ values, setSel, sel, style }: PropsType) => {
  return (
    <div className={styles.FilterButton} style={style}>
      {values?.map((v: any, index: any) => {
        return (
          <div
            key={index}
            className={sel == v.value ? styles.active : ""}
            onClick={() => setSel(v.value)}
          >
            <p>{v.name}</p>
            {v.badge && <p className={styles.badge}>{v.badge}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default FilterButton;
