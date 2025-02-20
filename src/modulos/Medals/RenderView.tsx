import DataModal from "@/mk/components/ui/DataModal/DataModal";
import styles from "./Medals.module.css";
import KeyValue from "@/mk/components/ui/KeyValue/KeyValue";
import { getUrlImages } from "@/mk/utils/string";

const RenderView = (props: {
  open: boolean;
  onClose: any;
  item: Record<string, any>;
  onConfirm?: Function;
}) => {
  return (
    <DataModal
      open={props.open}
      onClose={props?.onClose}
      title={"Detalle de insignia"}
      buttonText=""
      buttonCancel=""
      className={styles.renderView}
    >
      <div>
        <section>
          <img
            src={getUrlImages(
              "/MEDAL-" + props?.item?.id + ".webp?d=" + props?.item?.updated_at
            )}
            style={{
              width: 200,
              height: 200,
              // filter: "drop-shadow(0 0 0.75rem var(--cInfo))",
            }}
          />
        </section>
        <KeyValue title="Nombre" value={props.item?.name} size="14" />
        {props.item.description && (
          <KeyValue
            title="Descripción"
            value={props.item?.description}
            size="14"
          />
        )}
        <KeyValue title="Puntos" value={props.item?.points} size="14" />
        <KeyValue
          title="Puntos generales"
          value={props.item?.points_gral}
          size="14"
        />
      </div>
    </DataModal>
  );
};

export default RenderView;
