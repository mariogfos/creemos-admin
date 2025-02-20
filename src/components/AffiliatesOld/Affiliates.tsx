import List from "@/mk/components/ui/List/List";
import Table from "@/mk/components/ui/Table/Table";
import useAxios from "@/mk/hooks/useAxios";
import { useState } from "react";
import LoadingScreen from "@/mk/components/ui/LoadingScreen/LoadingScreen";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import useScreenSize from "@/mk/hooks/useScreenSize";
import styles from "./affiliates.module.css";
import DetailAffiliate from "./DetailAffiliate";
import { WidgetSkeleton } from "@/mk/components/ui/Skeleton/Skeleton";

const Affiliates = () => {
  const {
    data: admins,
    reLoad,
    execute,
    loaded,
    waiting,
  }: any = useAxios("/affiliates", "GET", {
    relations: ["affiliates"],
    page: 1,
    perPage: -1,
    orderBy: "desc",
    sortBy: "created_at",
  });
  const { isTablet } = useScreenSize();
  const [openDetail, setOpenDetail] = useState(false);
  const [item, setItem] = useState({} as any);

  const openDetailUsers = (item: any) => {
    setItem(item);
    setOpenDetail(true);
  };
  if (!loaded) return <WidgetSkeleton />;
  const renderItem = (row: any) => {
    return (
      <div onClick={() => openDetailUsers(row)}>
        <ItemList
          title={getFullName(row)}
          subtitle={"CI: " + row.ci}
          variant="V1"
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
    <div className={styles.users}>
      <h1 className="tTitle">Afiliados</h1>
      <h2>Lista de Afiliados</h2>
      <div>
        <LoadingScreen type="TableSkeleton">
          {!isTablet ? (
            <div
              style={{
                position: "relative",
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingBottom: "70px",
              }}
            >
              <Table
                data={admins?.data}
                onRowClick={openDetailUsers}
                header={[
                  {
                    key: "ci",
                    responsive: "onlyDesktop",
                    label: "CI",
                    width: "20%",
                  },
                  {
                    key: "name",
                    responsive: "onlyDesktop",
                    label: "Nombre",
                    width: "20%",
                  },
                  {
                    key: "last_name",
                    responsive: "onlyDesktop",
                    label: "Apellido",
                    width: "20%",
                  },

                  {
                    key: "email",
                    responsive: "onlyDesktop",
                    label: "Email",
                    width: "20%",
                  },
                  // {
                  //   key: "affiliates",
                  //   responsive: "onlyDesktop",
                  //   label: "Fecha",
                  //   width: "20%",
                  // },
                ]}
              />
            </div>
          ) : (
            <div
              style={{
                position: "relative",
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingBottom: "70px",
              }}
            >
              <List data={admins?.data} renderItem={renderItem} />
            </div>
          )}
        </LoadingScreen>
      </div>
      <div></div>
      <DetailAffiliate
        open={openDetail}
        close={() => setOpenDetail(false)}
        item={item}
        id={item.id}
      />
    </div>
  );
};

export default Affiliates;
