import DataModal from "@/mk/components/ui/DataModal/DataModal";
import styles from "./Affiliates.module.css";
import { getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getFullName } from "../../mk/utils/string";
import { getDateStrMes } from "@/mk/utils/date";

const RenderView = (props: {
  open: boolean;
  onClose: any;
  item: Record<string, any>;
  onConfirm?: Function;
  extraData?: any;
}) => {
  // const { data: typeCant } = useAxios("/typecands", "GET", {
  //   fullType: "L",
  //   searchBy: "",
  // });

  //   console.log(typeCant);
  // console.log(props.item?.data);
  // console.log(props?.extraData);
  // let entidades = ["", "", "Provincia", "Cantón", "Parroquia", "Barrio"];

  // const getEntidad = () => {
  //   let entidad = ["", "", "prov", "canton", "parish", "barrio"];
  //   let data: any = [];
  //   if (props.item?.data?.level) {
  //     data =
  //       props?.extraData[
  //         entidad[props.item?.data.level] + `${props.item?.data.level == 4 ? "es" : "s"}`
  //       ];
  //   }
  //   return data?.find(
  //     (e: any) => e.id == props.item?.data?.[entidad[props.item?.data.level] + "_id"]
  //   )?.name;
  // };
  console.log(props.item);
  return (
    <DataModal
      open={props.open}
      onClose={props?.onClose}
      title={"Detalle del Afiliado"}
      buttonText=""
      buttonCancel=""
    >
      <div className={styles.container}>
        <div>
          <Avatar
            src={getUrlImages(
              "/AFF-" +
                props.item?.data.id +
                ".webp?d=" +
                props.item?.data.updated_at
            )}
            h={100}
            w={100}
            name={getFullName(props?.item?.data)}
          />
          <div>
            <p className={styles.title}>{getFullName(props.item?.data)}</p>
            <p style={{ color: "var(--cWhiteV1)", fontSize: "var(--sL)" }}>
              {props.item?.data.barrio}
            </p>
            {props.item?.data.created_at && (
              <div style={{ color: "var(--cWhiteV1)" }}>
                Afiliado el {getDateStrMes(props.item?.data.created_at)}
              </div>
            )}
            {/* {props?.item?.level > 1 && (
              <p style={{ fontSize: 10 }}>
                {entidades[props?.item.level] + ": " + getEntidad()}
              </p>
            )} */}
          </div>
        </div>
        <section>
          {/* {props?.item?.level > 1 && (
            <div>
              <p>{entidades[props?.item.level]}</p>
              <p>{getEntidad()}</p>
            </div>
          )} */}
          <div>
            <p>Departamento</p>
            <p>{props.item?.data?.dpto || "No proporcionado"}</p>
          </div>
          <div>
            <p>Correo electrónico</p>
            <p>{props.item?.data?.email || "No proporcionado"}</p>
          </div>
          <div>
            <p>Número de Whatsapp</p>
            <p>
              {props.item?.data?.prefix_phone && props.item?.data?.prefix_phone}{" "}
              {props.item?.data?.phone || "No proporcionado"}
            </p>
          </div>
        </section>
      </div>
    </DataModal>
  );
};

export default RenderView;
