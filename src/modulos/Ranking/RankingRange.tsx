import styles from "./Ranking.module.css";
import {
  IconArrowLeft,
  IconArrowRight,
} from "@/components/layout/icons/IconsBiblioteca";

const RankingRange = ({
  yearWeeks,
  formState,
  setFormState,
  index,
  setIndex,
}: any) => {
  const onClickLeft = () => {
    if (index < yearWeeks.length - 1) {
      setFormState({ ...formState, year_week: yearWeeks?.[index + 1]?.id });
      setIndex(index + 1);
    }
  };
  const onClickRight = () => {
    if (index > 0) {
      setFormState({ ...formState, year_week: yearWeeks?.[index - 1]?.id });
      setIndex(index - 1);
    }
  };
  return (
    <div className={styles.rankingRange}>
      <IconArrowLeft
        onClick={onClickLeft}
        style={{
          color:
            index === yearWeeks.length - 1
              ? "var(--cBlackV2)"
              : "var(--cWhiteV1)",
          cursor: index === yearWeeks.length - 1 ? "" : "pointer",
        }}
      />
      <p>Semana: {yearWeeks?.[index]?.name}</p>
      <IconArrowRight
        onClick={onClickRight}
        style={{
          color: index === 0 ? "var(--cBlackV2)" : "var(--cWhiteV1)",
          cursor: index === 0 ? "" : "pointer",
        }}
      />
    </div>
  );
};

export default RankingRange;
