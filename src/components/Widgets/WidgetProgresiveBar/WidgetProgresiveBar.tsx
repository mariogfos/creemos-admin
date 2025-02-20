import ProgresiveBar from "@/mk/components/ui/ProgresiveBar/ProgresiveBar";
import styles from "./WidgetProgresiveBar.module.css";
import { formatNumber } from "@/mk/utils/numbers";

const WidgetProgresiveBar = ({ data, poblacion }: any) => {
  const { totalAfiliados, totalHabilitados, level }: any = data;

  return (
    <div className={styles["WidgetProgresiveBar"]}>
      <div>
        Esta barra refleja la cantidad de afiliados a nivel{" "}
        {level == 1 ? "nacional" : level == 2 ? "departamento" : "municipio"}{" "}
        con relación a los{" "}
        {poblacion?.label?.charAt(0).toLowerCase() + poblacion?.label?.slice(1)}{" "}
        para votar
      </div>
      <ProgresiveBar
        topLabels
        bottomLabels
        total={totalHabilitados}
        actualValue={totalAfiliados}
        titleTotal={poblacion?.label}
        titleActualValue={`${formatNumber(totalAfiliados, 0)} Afiliados`}
      />
    </div>
  );
};

export default WidgetProgresiveBar;
