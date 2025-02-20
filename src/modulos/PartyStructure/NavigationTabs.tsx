import React from "react";
import styles from "./users.module.css";
import { useNavigation } from "./NavigationContext";

const NavigationTabs = ({ activeLevels, handleGoBack }: any) => {
  const { current } = useNavigation();

  const hierarchy = [
    { level: "list", label: "Mi organización (lista)" },
    {
      level: "department",
      label: "Red de Ramón Velarde Farías (departamental)",
    },
    { level: "locality", label: "Red de Ramón Velarde Farías (localidad)" },
    { level: "neighborhood", label: "Red de Ramón Velarde Farías (barrio)" },
  ];

  const currentIndex = hierarchy.findIndex((h) => h.level === current.level);

  return (
    <div className={styles.tabs}>
      {hierarchy.map(
        (h, index) =>
          activeLevels.includes(h.level) && (
            <span
              key={h.level}
              className={`${styles.tab} ${
                index === currentIndex ? styles.activeTab : styles.inactiveTab
              }`}
              onClick={index <= currentIndex ? handleGoBack : undefined}
              style={{
                color: index === currentIndex ? "#F5951C" : "#c6c6c6",
                cursor: index <= currentIndex ? "pointer" : "default",
              }}
            >
              {h.label}
            </span>
          )
      )}
    </div>
  );
};

export default NavigationTabs;
