import DataModal from "@/mk/components/ui/DataModal/DataModal";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import styles from "./Levels.module.css"
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";

const RenderView = (props: {
  open: boolean;
  onClose: any;
  item: Record<string, any>;
  onConfirm?: Function;
}) => {
  const { name ,description, points, league_id } = props?.item;

  const commentList = (item: any) => {
    return (
      <ItemList
        title={getFullName(item.affiliate)}
        subtitle={item?.comment}
        left={
          <Avatar
            name={item?.name}
            src={getUrlImages(
              "/AFF-" + item?.affiliate_id + ".webp?d=" + item?.updated_at
            )}
          />
        }
      />
    );
  };
  return (
    <DataModal
      open={props.open}
      onClose={props?.onClose}
      title={"Detalle del nivel"}
      buttonText=""
      buttonCancel=""
      className={styles.renderView}
    >
        <div>
            <div>Nombre : {name}</div>
            {description &&  <div>Descripción : {description}</div>}
            <div>Puntos : {points}</div>
       </div>
    </DataModal>
  );
};

export default RenderView;
