import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { Card } from "@/mk/components/ui/Card/Card";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import List from "@/mk/components/ui/List/List";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import styles from "./WidgetAffiliatesRank.module.css";
import { formatNumberCustom } from "../../../mk/utils/date";

const WidgetAffiliatesRank = ({ data }: any) => {
  //  console.log(data,'rank');

  const renderItem = (row: any) => {
    return (
      <div
      //   onClick={() => openDetailUsers(row)}
      >
        <ItemList
          title={getFullName(row)}
          subtitle={formatNumberCustom(row.total_affiliates) + " afiliados"}
          variant="V2"
          left={
            <Avatar
              name={getFullName(row)}
              src={getUrlImages("/AFF-" + row.id + ".webp?d=" + row.updated_at)}
            />
          }
        />
      </div>
    );
  };

  return (
    <div className={styles["WidgetAffiliatesRank"]}>
      <div>Miembros destacados</div>
      <div>Lista de usuarios con mayor cantidad de afiliados registrados</div>
      <List data={data} renderItem={renderItem} />
    </div>
  );
};

export default WidgetAffiliatesRank;
