import React, { useEffect, useState } from "react";
import styles from "./Ranking.module.css";
import useAxios from "@/mk/hooks/useAxios";
import { getCurrentYearWeek } from "@/mk/utils/date";
import RankingTopTable from "@/modulos/Ranking/RankingTopTable/RankingTopTable";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import {
  IconDownSolid,
  IconEqualSolid,
  IconUpSolid,
} from "@/components/layout/icons/IconsBiblioteca";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import RankingHeader from "./RankingHeader";
import RankingTop3Banner from "./RankingTop3Banner/RankingTop3Banner";
import RankingRange from "./RankingRange";
import bgGold from "@/../public/images/backgroundGold.png";
import { WidgetSkeleton } from "@/mk/components/ui/Skeleton/Skeleton";
import DetailAffiliate from "@/components/AffiliatesOld/DetailAffiliate";

const RankingNational = ({ extraData }: any) => {
  const [index, setIndex] = useState(0);
  const { execute, waiting, error, loaded } = useAxios();
  const [dataNat, setDataNat]: any = useState([]);
  const [userId, setUserId]: any = useState(null);
  const [formState, setFormState]: any = useState({
    year_week: extraData?.year_weeks?.[0]?.id,
  });
  const [top3Data, setTop3Data] = useState([]);
  const [tableData, setTableData] = useState([]);

  const getRankingNat = async () => {
    const { data: rankingNat } = await execute("/historicalrankings", "GET", {
      fullType: "L",
      ...formState,
    });
    if (rankingNat?.success == true) {
      setDataNat(rankingNat);
    }
  };

  useEffect(() => {
    if (dataNat?.data) {
      const sortedData: any = [...dataNat.data].sort(
        (a, b) => a.position - b.position
      );

      const top3 = sortedData?.length >= 3 ? sortedData?.slice(0, 3) : [];
      const table = sortedData?.length > 3 ? sortedData?.slice(3) : [];
      setTop3Data(top3);
      setTableData(table);
    }
  }, [dataNat]);
  useEffect(() => {
    getRankingNat();
  }, [formState]);
  //  console.log(dataNat,'dataNat')
  if (!loaded) return <WidgetSkeleton />;
  // if (!loaded) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los rankings.</div>;
  return (
    <>
      <div className={styles.rankingTop}>
        <div>
          <div>
            <RankingHeader type={"N"} />
          </div>
          <div>
            <RankingRange
              yearWeeks={extraData?.year_weeks}
              formState={formState}
              setFormState={setFormState}
              index={index}
              setIndex={setIndex}
            />
          </div>
          <div>
            <RankingTop3Banner
              data={top3Data}
              image={bgGold.src}
              emptyMsg="El conteo para este ranking aún no ha iniciado. ¡Vuelve pronto para descubrir quiénes son los mejores afiliados!"
            />
            <RankingTopTable
              data={tableData}
              type={"N"}
              setDetailId={setUserId}
            />
          </div>
        </div>
      </div>
      {userId && (
        <DetailAffiliate
          id={userId}
          close={() => setUserId(null)}
          open={true}
        />
      )}
    </>
  );
};

export default RankingNational;
