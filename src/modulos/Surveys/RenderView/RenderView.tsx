import ViewSurveys from "@/modulos/Surveys/ViewSurvey/ViewSurveys";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import { useAuth } from "@/mk/contexts/AuthProvider";
import useScreenSize from "@/mk/hooks/useScreenSize";

const RenderView = (props: {
  open: boolean;
  onClose: any;
  item: Record<string, any>;
  onConfirm?: Function;
  onEdit?: Function;
  extraData?: any;
}) => {
  const { user } = useAuth();
  const { isTablet } = useScreenSize();
  const edit = () => {
    props.onEdit && props.onEdit(props.item);
    props.onClose();
  };

  return (
    <DataModal
      open={props.open}
      onClose={props?.onClose}
      title={"Detalle de encuesta"}
      buttonText=""
      buttonCancel=""
      // fullScreen={isTablet}
      fullScreen={true}
    >
      <ViewSurveys
        extraData={props.extraData}
        data={props?.item}
        user={user}
        edit={edit}
        onChangeParams={() => console.log("nothing")}
      />
    </DataModal>
  );
};

export default RenderView;
