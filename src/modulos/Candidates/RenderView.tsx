import DataModal from "@/mk/components/ui/DataModal/DataModal";
import styles from "./Candidates.module.css";
import { getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getFullName } from "../../mk/utils/string";
import useAxios from "@/mk/hooks/useAxios";
import {
  IconBorn,
  IconCandidates,
  IconFacebook,
  IconInstagram,
  IconLinkedin,
  IconPDF,
  IconProfession,
  IconTwitter,
  IconX,
} from "@/components/layout/icons/IconsBiblioteca";
import { lIdeologies } from "@/mk/utils/utils";

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

  console.log("item: ", props.item);
  return (
    <DataModal
      open={props.open}
      onClose={props?.onClose}
      title={"Detalle del candidato"}
      buttonText=""
      buttonCancel=""
    >
      <div className={styles.container}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "100%",
              overflow: "hidden",
              height: "300px",
              borderRadius: 8,
            }}
          >
            <img
              src={getUrlImages(
                "/PCAND-" + props.item.id + ".webp?d=" + props.item.updated_at
              )}
              alt={props.item?.data?.name}
              style={{
                width: "100%",
                height: "auto",
                overflow: "visible",
                borderRadius: 8,
              }}
            />
          </div>
          <Avatar
            className={styles.avatar}
            name={props.item?.data?.name}
            src={getUrlImages(
              "/CAND-" + props.item.id + ".webp?d=" + props.item.updated_at
            )}
            h={140}
            w={140}
          />
        </div>
        {/* <img
          src={getUrlImages(
            "/CAND-" + props.item.id + ".webp?d=" + props.item.updated_at
          )}
          alt={props.item?.data?.name}
          width={100}
          height={100}
        /> */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <p
              style={{
                marginTop: 80,
                color: "var(--cWhite)",
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {getFullName(props.item)}
            </p>
            <p className={styles.description}>{props.item?.title}</p>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconCandidates color="var(--cBlackV2)" />
              <p className={styles.subtitle}>
                {
                  props.extraData?.typeCands?.find(
                    (e: any) => e.id == props.item?.typecand_id
                  ).name
                }
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconProfession color="var(--cBlackV2)" />
              <p className={styles.subtitle}>{props.item?.profession}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconBorn color="var(--cBlackV2)" />
              <p className={styles.subtitle}>
                {"Nació en " + props.item?.born}
              </p>
            </div>
          </div>
          {/* <div style={{ display: "flex", alignItems: "center" }}>
          {props.item?.born}
        </div> */}

          {props?.item?.facebook?.length > 0 ||
          props?.item?.instagram?.length > 0 ||
          props?.item?.linkedin?.length > 0 ||
          props?.item?.twitter?.length > 0 ? (
            <>
              <p
                style={{
                  fontSize: "var(--sL)",
                  marginBottom: 0,
                  color: "var(--cWhite)",
                  fontWeight: 600,
                }}
              >
                Redes sociales
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                {props?.item?.twitter?.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "var(--cBlackV1)",
                      padding: 4,
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const url = props?.item?.twitter; // Obtiene la URL de la red social
                      if (url) {
                        window.open(url, "_blank"); // Abre el enlace en una nueva pestaña
                      } else {
                        console.error(
                          "No se encontró la URL de la red social."
                        );
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--cBlackV3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--cBlackV1)";
                    }}
                  >
                    <IconTwitter />
                  </div>
                )}
                {props?.item?.linkedin?.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "var(--cBlackV1)",
                      padding: 4,
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const url = props?.item?.linkedin; // Obtiene la URL de la red social
                      if (url) {
                        window.open(url, "_blank"); // Abre el enlace en una nueva pestaña
                      } else {
                        console.error(
                          "No se encontró la URL de la red social."
                        );
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--cBlackV3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--cBlackV1)";
                    }}
                  >
                    <IconLinkedin />
                  </div>
                )}
                {props?.item?.facebook?.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "var(--cBlackV1)",
                      padding: 4,
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const url = props?.item?.facebook; // Obtiene la URL de la red social
                      if (url) {
                        window.open(url, "_blank"); // Abre el enlace en una nueva pestaña
                      } else {
                        console.error(
                          "No se encontró la URL de la red social."
                        );
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--cBlackV3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--cBlackV1)";
                    }}
                  >
                    <IconFacebook />
                  </div>
                )}
                {props?.item?.instagram?.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "var(--cBlackV1)",
                      padding: 4,
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const url = props?.item?.instagram; // Obtiene la URL de la red social
                      if (url) {
                        window.open(url, "_blank"); // Abre el enlace en una nueva pestaña
                      } else {
                        console.error(
                          "No se encontró la URL de la red social."
                        );
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--cBlackV3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--cBlackV1)";
                    }}
                  >
                    <IconInstagram />
                  </div>
                )}
              </div>
            </>
          ) : null}
          {props?.item?.ideology > 0 && (
            <div>
              <p className={styles.title}>Ideología política</p>
              <p className={styles.subtitle} style={{ marginTop: 12 }}>
                {lIdeologies[props?.item?.ideology]?.name}
              </p>
            </div>
          )}
          <div>
            <p className={styles.title}>Biografía</p>
            <p style={{ marginTop: 12 }} className={styles.subtitle}>
              {props.item?.biography}
            </p>
          </div>
          <div>
            <p className={styles.title}>Experiencia política</p>
            <p className={styles.subtitle} style={{ marginTop: 12 }}>
              {props.item?.experience}
            </p>
          </div>
          <div>
            <p className={styles.title}>Plan de gobierno</p>
            <div className={styles.subtitle} style={{ marginTop: 12 }}>
              <a
                href={getUrlImages(
                  "/PLAN-" +
                    props?.item?.id +
                    ".pdf?d=" +
                    props?.item?.updated_at
                )}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "var(--cInfo)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "var(--cBlackV1)",
                    padding: 8,
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--cBlackV3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--cBlackV1)";
                  }}
                >
                  <IconPDF />
                  <span style={{ textDecorationLine: "underline" }}>
                    Descargar PDF
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </DataModal>
  );
};

export default RenderView;
