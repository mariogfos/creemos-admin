import React, { useEffect, useState } from "react";
import styles from "./Ranking.module.css";
import useAxios from "@/mk/hooks/useAxios";
import RankingHeader from "./RankingHeader";
import RankingRange from "./RankingRange";
import RankingTop3Banner from "./RankingTop3Banner/RankingTop3Banner";
import RankingTopTable from "@/modulos/Ranking/RankingTopTable/RankingTopTable";
import bgSylver from "@/../public/images/backgroundSylver.png";
import { useAuth } from "@/mk/contexts/AuthProvider";
import { WidgetSkeleton } from "@/mk/components/ui/Skeleton/Skeleton";
import DetailAffiliate from "@/components/AffiliatesOld/DetailAffiliate";

const RankingProvincial = ({ extraData }: any) => {
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const { execute, waiting, error, loaded } = useAxios();
  const [dataProv, setDataProv]: any = useState([]);
  const [userId, setUserId]: any = useState(null);
  const [formState, setFormState]: any = useState({
    year_week: extraData?.year_weeks?.[0]?.id,
    dpto_id: user?.datos?.dpto_id,
  });
  const [top3Data, setTop3Data] = useState([]);
  const [tableData, setTableData] = useState([]);

  const getRankingProv = async () => {
    const { data: rankingProv } = await execute("/historicalrankings", "GET", {
      fullType: "L",
      ...formState,
    });
    if (rankingProv?.success == true) {
      setDataProv(rankingProv);
    }
  };

  useEffect(() => {
    getRankingProv();
  }, [formState]);
  useEffect(() => {
    if (dataProv?.data) {
      const sortedData: any = [...dataProv.data].sort(
        (a, b) => a.position - b.position
      );

      const top3 = sortedData?.length >= 3 ? sortedData?.slice(0, 3) : [];
      const table = sortedData?.length > 3 ? sortedData?.slice(3) : [];
      setTop3Data(top3);
      setTableData(table);
    }
  }, [dataProv]);

  if (!loaded) return <WidgetSkeleton />;

  if (error) return <div>Error al cargar los rankings.</div>;

  return (
    <>
      <div className={styles.rankingTop}>
        <div>
          <div>
            <RankingHeader
              type={"P"}
              dptos={extraData?.dptos}
              formState={formState}
              setFormState={setFormState}
            />
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
              image={bgSylver.src}
              emptyMsg="El ranking para esta departamento aún no ha sido procesada"
            />
            <RankingTopTable
              data={tableData}
              type={"P"}
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

export default RankingProvincial;
