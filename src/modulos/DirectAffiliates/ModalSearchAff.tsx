"use client";

import DataModal from "@/mk/components/ui/DataModal/DataModal";
import React, { useState } from "react";
import useAxios from "@/mk/hooks/useAxios";
import LoadingScreen from "@/mk/components/ui/LoadingScreen/LoadingScreen";
import styles from "./DirectAffiliates.module.css";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import DetailAffiliate from "@/components/AffiliatesOld/DetailAffiliate";
type PropsDetailUsers = {
  open: boolean;
  close: () => void;
  searchBy?: any;
};

const ModalSearchAff = ({ open, close, searchBy }: PropsDetailUsers) => {
  const { data, loaded } = useAxios("/affiliates", "GET", {
    searchBy: searchBy,
    fullType: "L",
  });
  const [userId, setUserId]: any = useState(null);

  const results = data?.data || [];

  return (
    <>
      <DataModal
        open={open}
        onClose={() => close()}
        title={!loaded ? "Cargando..." : "Resultados de la búsqueda"}
        buttonText=""
        buttonCancel=""
      >
        <LoadingScreen loaded={loaded} onlyLoading={true}>
          <div>
            {results.length > 0 ? (
              <div className={styles.affiliatesSearch}>
                {results.map((item: any, index: number) => (
                  <div key={item.affiliate_id}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserId(item.affiliate_id);
                      }}
                    >
                      <p>
                        {index + 1} / {results?.length}
                      </p>
                      <Avatar
                        name={getFullName(item)}
                        src={getUrlImages(
                          "/AFF-" +
                            item?.affiliate_id +
                            ".webp?d=" +
                            item?.affiliate?.updated_at
                        )}
                      />
                      <div>
                        <p>{getFullName(item)}</p>
                        <p>Afiliados directos: {item?.dsponsors_count}</p>
                      </div>
                    </div>
                    <div>
                      <p>Nivel: {item?.level}</p>
                      <p>Puntos: {item?.points}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No se encontraron resultados.</p>
            )}
          </div>
        </LoadingScreen>
      </DataModal>
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

export default ModalSearchAff;
