import React, { useState } from "react";
import styles from "./RankingTop3Banner.module.css";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getUrlImages } from "@/mk/utils/string";
import {
  IconFirstPlace,
  IconSecondPlace,
  IconThirdPlace,
} from "@/components/layout/icons/IconsBiblioteca";
import Image from "next/image";
import crown from "@/../public/images/AvatarCampeon.png";
import emptyImg from "@/../public/images/emptyScreenRank.png";
import { getFullName } from "../../../mk/utils/string";
import { formatNumber } from "@/mk/utils/numbers";
import DetailAffiliate from "@/components/AffiliatesOld/DetailAffiliate";

interface RankingTop3BannerProps {
  image?: any;
  data: any;
  emptyMsg?: string;
}

interface RankingCardProps {
  affiliate: any;
  prov: string;
  canton?: string;
  points: number | string;
  size: number;
  borderColor?: string;
  icon: React.ReactNode;
  crownImage?: boolean;
  onClick?: any;
}

const RankingCard: React.FC<RankingCardProps> = ({
  affiliate,
  prov,
  canton,
  points,
  size,
  borderColor,
  icon,
  crownImage,
  onClick,
}) => (
  <div className={styles.card} onClick={onClick}>
    <div style={{ position: "relative" }}>
      <Avatar
        src={getUrlImages(
          "/AFF-" + affiliate?.id + ".webp?d=" + affiliate?.updated_at
        )}
        name={getFullName(affiliate)}
        styleText={{ fontWeight: 600, fontSize: 16 }}
        w={size}
        h={size}
        style={{ border: `5px solid ${borderColor || "#000"}` }}
      />
      {crownImage && (
        <Image
          src={crown}
          alt="crownavatar"
          width={132}
          height={150}
          style={{ position: "absolute", objectFit: "contain", top: -40 }}
        />
      )}
      <div className={styles.iconPlaces}>{icon}</div>
    </div>
    <h3>{affiliate?.name}</h3>
    <h4>{prov || canton}</h4>
    <section>{points || 0} puntos</section>
  </div>
);

const RankingTop3Banner = ({
  image,
  data,
  emptyMsg,
}: RankingTop3BannerProps) => {
  const [userId, setUserId]: any = useState(null);
  if (!data || data.length < 3) {
    return (
      <div className={styles.emptyRank}>
        <Image
          src={emptyImg}
          alt="No hay datos para mostrar"
          width={220}
          height={220}
          style={{}}
        />
        <div>SIN DATOS</div>
        <p>{emptyMsg || "No hay datos para mostrar"}</p>
      </div>
    );
  }
  return (
    <>
      <div
        className={styles.rankingTop3Banner}
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className={styles.cardsContainer}>
          <RankingCard
            // affiliate={data[1]?.affiliate?.[0]}
            affiliate={data[1]?.affiliate}
            prov={data[1]?.prov}
            points={formatNumber(data[1]?.points, 0)}
            canton={data[1]?.canton}
            size={64}
            borderColor="#477D95"
            icon={<IconSecondPlace size={32} />}
            onClick={() => setUserId(data[1]?.affiliate?.id)}
          />
          <RankingCard
            // affiliate={data[0]?.affiliate?.[0]}
            affiliate={data[0]?.affiliate}
            prov={data[0]?.prov}
            points={formatNumber(data[0]?.points, 0)}
            canton={data[0]?.canton}
            size={92}
            borderColor="#FFD700"
            icon={<IconFirstPlace size={32} />}
            crownImage={true}
            onClick={() => setUserId(data[0]?.affiliate?.id)}
          />
          <RankingCard
            // affiliate={data[2]?.affiliate?.[0]}
            affiliate={data[2]?.affiliate}
            prov={data[2]?.prov}
            canton={data[2]?.canton}
            points={formatNumber(data[2]?.points, 0)}
            size={64}
            borderColor="#B48146"
            icon={<IconThirdPlace size={32} />}
            onClick={() => setUserId(data[2]?.affiliate?.id)}
          />
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

export default RankingTop3Banner;
