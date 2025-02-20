import { IconInfoApp } from "@/components/layout/icons/IconsBiblioteca";
import React from "react";
import styles from "./Empty.module.css";

type PropsType = {
  msg: string;
};

const Empty = ({ msg }: PropsType) => {
  return (
    <div className={styles.empty}>
      <IconInfoApp />
      <p>{msg} </p>
    </div>
  );
};

export default Empty;
