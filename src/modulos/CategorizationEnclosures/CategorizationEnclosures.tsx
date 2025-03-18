import { IconProfession } from "@/components/layout/icons/IconsBiblioteca";
import WidgetBase from "@/components/Widgets/WidgetBase/WidgetBase";
import WidgetGeneralResults from "@/components/Widgets/WidgetGeneralResults/WidgetGeneralResults";
import React from "react";
import styles from "./CategorizationEnclosures.module.css";
type TypeProps = {
  data: any;
};

const CategorizationEnclosures = ({ data }: TypeProps) => {
  return (
    <div className={styles.CategorizationEnclosures}>
      <WidgetBase title="Resultados generales" className={styles.widget}>
        <WidgetGeneralResults
          text="Recintos habilitados"
          value={"1,091"}
          icon={<IconProfession />}
        />
        <WidgetGeneralResults
          text="Recintos habilitados"
          value={"1,091"}
          icon={<IconProfession />}
        />
        <WidgetGeneralResults
          text="Recintos habilitados"
          value={"1,091"}
          icon={<IconProfession />}
        />
        <WidgetGeneralResults
          text="Recintos habilitados"
          value={"1,091"}
          icon={<IconProfession />}
        />
        <WidgetGeneralResults
          text="Recintos habilitados"
          value={"1,091"}
          icon={<IconProfession />}
        />
        <WidgetGeneralResults
          text="Recintos habilitados"
          value={"1,091"}
          icon={<IconProfession />}
        />
      </WidgetBase>
    </div>
  );
};

export default CategorizationEnclosures;
