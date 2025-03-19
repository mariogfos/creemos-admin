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
      <WidgetBase title="Resultados generales">
        <div className={styles.widget}>
          <WidgetGeneralResults
            text="Recintos habilitados"
            value={"1,091"}
            icon={<IconProfession size={40} color={"var(--cBlackV2)"} />}
          />
          <WidgetGeneralResults
            text="Mesas habilitadas"
            value={"9,170"}
            icon={<IconProfession size={40} color={"var(--cBlackV2)"} />}
          />
          <WidgetGeneralResults
            text="Votos habilitados"
            value={"1,914,621"}
            icon={<IconProfession size={40} color={"var(--cBlackV2)"} />}
          />
          <WidgetGeneralResults
            text="Votos válidos"
            value={"1,545,658"}
            icon={<IconProfession size={40} color={"var(--cBlackV2)"} />}
          />
          <WidgetGeneralResults
            text="Votos obtenidos por creemos"
            value={"860,023"}
            icon={<IconProfession size={40} color={"var(--cBlackV2)"} />}
          />
          <WidgetGeneralResults
            text="Votos obtenidos por MAS-IPSP"
            value={"589,970"}
            icon={<IconProfession size={40} color={"var(--cBlackV2)"} />}
          />
        </div>
      </WidgetBase>
    </div>
  );
};

export default CategorizationEnclosures;
