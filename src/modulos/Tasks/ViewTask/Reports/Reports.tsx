import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { Card } from "@/mk/components/ui/Card/Card";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import React from "react";
import styles from "./Reports.module.css";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { getDateTimeStrMes } from "@/mk/utils/date";
import Empty from "../Empty/Empty";

const Reports = ({ data }: any) => {
  return data.length > 0 ? (
    data?.map((d: any, index: any) => {
      return (
        <Card variant="V1" className={styles.Reports} key={index}>
          <p style={{}}>{getDateTimeStrMes(d?.created_at)}</p>
          <ItemList
            // style={{ paddingLeft: 0 }}
            left={
              <Avatar
                name={getFullName(d?.affiliate)}
                src={getUrlImages(
                  "/AFF-" +
                    d.affiliate_id +
                    ".webp?d=" +
                    d?.affiliate?.updated_at
                )}
              />
            }
            title={getFullName(d?.affiliate)}
            // right={
            //   <div style={{ display: "flex", gap: 8 }}>
            //     <Button variant="secondary">Rechazar</Button>
            //     <Button>Aceptar</Button>
            //   </div>
            // }
          />
          <p>{d?.description}</p>
          <a
            target="_blank"
            href={getUrlImages(
              "/TASKREPORT-" + d.id + ".webp?d=" + d?.updated_at
            )}
          >
            Ver imagen
          </a>
        </Card>
      );
    })
  ) : (
    <Empty msg="No existen reportes" />
  );
};

export default Reports;
