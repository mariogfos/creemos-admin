import React from "react";
import rankNat from "@/../public/images/rankingnat.png";
import rankProv from "@/../public/images/rankingprov.png";
import Image from "next/image";
import styles from "./Ranking.module.css";
import Select from "@/mk/components/forms/Select/Select";

interface InputCodeProps {
  type: string;
  dptos?: any;
  formState?: any;
  setFormState?: any;
}

const RankingHeader = ({
  type,
  dptos,
  formState,
  setFormState,
}: InputCodeProps) => {
  const handleChange = (e: any) => {
    let value = e.target.value;
    setFormState({ ...formState, [e.target.name]: value });
  };

  return (
    <div className={styles.rankingHeader}>
      <div>
        <div>
          <Image
            src={type === "N" ? rankNat : rankProv}
            alt="Ranking"
            width={140}
            height={140}
          />
        </div>
        <div>
          <h1>{type === "N" ? "Ranking Nacional" : "Ranking Departamental"}</h1>
          <p>
            {type === "N" ? (
              <>
                Mira el <strong>TOP 10</strong> de los afiliados más activos en
                Elekta.
              </>
            ) : (
              <>
                Mira el <strong>TOP 10</strong> de los afiliados por provincias
                más activos en Elekta.
              </>
            )}
          </p>
          {type === "P" && (
            <div>
              <Select
                label="Departamentos"
                name="dpto_id"
                options={dptos}
                onChange={handleChange}
                value={formState?.dpto_id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingHeader;
