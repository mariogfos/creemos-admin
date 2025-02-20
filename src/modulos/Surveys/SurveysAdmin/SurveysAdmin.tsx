import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import NotAccess from "@/components/auth/NotAccess/NotAccess";
import styles from "./SurveysAdmin.module.css";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import { useEffect, useMemo, useState } from "react";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import Input from "@/mk/components/forms/Input/Input";
import Button from "@/mk/components/forms/Button/Button";
import {
  IconInfoApp,
  IconTrash,
} from "@/components/layout/icons/IconsBiblioteca";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import Check from "@/mk/components/forms/Check/Check";
import {
  GMT,
  compareDate,
  differenceInDays,
  getDateStrMes,
  getDateTimeStrMesShort,
} from "@/mk/utils/date";
import Switch from "@/mk/components/forms/Switch/Switch";
import { FormFunctionRenderType } from "@/mk/hooks/useCrud/FormElement";
import Tooltip from "@/components/Tooltip/Tooltip";
import ImportDataModal from "@/mk/components/data/ImportDataModal/ImportDataModal";
import { useRouter } from "next/navigation";
import RenderView from "../RenderView/RenderView";
import RenderItem from "@/modulos/shared/RenderItem";
import useCrudUtils from "@/modulos/shared/useCrudUtils";
import RenderForm from "../RenderForm/RenderForm";

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};
// const isHide = (data: {
//   key: string;
//   user?: Record<string, any>;
//   item: Record<string, any>;
// }) => {
//   const level = data.user?.role.level;
//   // const level = 3;
//   if (data.key == "sublema_id") return level > 1;
//   if (data.key == "lista_id") return level > 2;
//   if (data.key == "dpto_id") return level > 4;
//   if (data.key == "local_id") return level > 5;
//   if (data.key == "barrio_id") return level > 6;
//   return false;
// };

// const lDestinies = (data: {
//   key: string;
//   user?: Record<string, any>;
//   item: Record<string, any>;
// }) => {
//   const r = [{ id: 0, name: "Todos" }];
//   const level = data.user?.role.level;
//   // const level = 3;
//   if (level <= 1) r.push({ id: 2, name: "Provincia" });
//   if (level <= 2) r.push({ id: 3, name: "Cantón" });
//   if (level <= 3) r.push({ id: 4, name: "Parroquia" });
//   // if (level <= 5) r.push({ id: 5, name: "Barrio" });
//   return r;
// };

const topDestiny = (data: {
  key: string;
  user?: Record<string, any>;
  item: Record<string, any>;
  error: Record<string, any>;
}) => {
  return (
    <ItemList
      title={getFullName(data.user)}
      subtitle={data?.user?.role?.name || "--"}
      variant="V2"
      style={{ width: "100%", marginLeft: -8 }}
      left={
        <Avatar
          name={getFullName(data.user)}
          src={getUrlImages(
            "/ADM-" + data.user?.id + ".png?" + data.user?.updated_at
          )}
        />
      }
    />
  );
};

const programSurvey = (data: FormFunctionRenderType) => {
  // const [valueSwitch, setValueSwitch] = useState("N");

  const onSelItem = (e: any) => {
    const { checked } = e.target;
    data.onChange({
      ...(checked
        ? { switch: "Y" }
        : { switch: "N", begin_at: null, end_at: null }),
    });
  };
  // const a = new Date(data.item?._initItem?.begin_at) + "===" + new Date();
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          marginTop: 16,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              marginBottom: "var(--spL)",
              fontSize: "var(--sL)",
              fontWeight: 600,
              color: "var(--cWhite)",
            }}
          >
            Programar encuesta
          </div>
          <Switch
            name="switch"
            optionValue={["Y", "N"]}
            value={data.item.switch || "N"}
            onChange={onSelItem}
            disabled={
              (data.item?._initItem?.begin_at &&
                new Date(data.item?._initItem?.begin_at) < new Date()) ||
              data?.item?._initItem?.sanswerscount > 0
            }
          />
        </div>
      </div>
      {/* {data.item.switch == "Y" && (
        <>
          <div style={{}}>Define el periodo de vigencia</div>
          <div style={{ display: "flex", gap: 8 }}>
            <Input
              type="date"
              name="begin_at"
              value={data.item.begin_at}
              error={data.item.errors}
              onChange={data.onChange}
              label="Inicio"
              disabled={
                data.item.begin_at &&
                compareDate(data.item.begin_at, new Date(), "<")
                  ? true
                  : false
              }
            />
            <Input
              type="date"
              name="end_at"
              value={data.item.end_at}
              onChange={data.onChange}
              error={data.item.errors}
              label="Finalización"
              disabled={
                data.item.end_at &&
                compareDate(data.item.end_at, new Date(), "<")
                  ? true
                  : false
              }
            />
          </div>
        </>
      )} */}
    </>
  );
};

const Roptions = (props: any) => {
  const { item, field, error, setItem } = props;
  let options = [
    ...(item?.options || [
      { id: -1, name: "" },
      { id: -2, name: "" },
    ]),
  ];
  const numres = Number(item.nresp) + 1 || 0;

  // if (numres >= options.length && field.action !== "edit" && numres < 40) {
  //   for (let i = options.length; i < numres; i++) {
  //     options.push({ id: (options.length + 1) * -1, name: "" });
  //   }
  // } else if (numres < options.length && field.action !== "edit") {
  //   options = options.slice(0, numres);
  // }

  useEffect(() => {
    setItem({ ...item, options: options });
  }, [item.nresp]);
  const onChange = (e: any) => {
    const { name, value } = e.target;
    const [key, index] = name.split(".");
    const opt: any = item.options;
    opt[index].name = value;
    setItem({ ...item, options: opt });
  };
  const onDelOption = (index: number) => {
    const opt: any = item.options;
    opt.splice(index, 1);
    setItem({ ...item, options: opt });
  };
  return (
    <>
      <div
        style={{
          color: "var(--cWhite)",
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        Opciones{" "}
        {error?.options && (
          <span style={{ color: "var(--cError)", fontSize: "10px" }}>
            {error.options}
          </span>
        )}
      </div>
      <br />
      {item?.options?.map((o: any, i: number) => (
        <div key={i} className={styles.option}>
          <Input
            type="text"
            name={"options." + i}
            value={o.name || ""}
            onChange={onChange}
            label={"Opción " + (i + 1)}
            disabled={field.disabled}
            onBlur={field.onBlur}
            error={error}
            onFocus={field.onFocus}
            iconLeft={field.iconLeft}
            iconRight={
              i >= numres &&
              field.action !== "edit" && (
                <IconTrash
                  color="red"
                  onClick={() => {
                    onDelOption(i);
                  }}
                />
              )
            }
            placeholder={field.placeholder}
            className={field.className}
            style={field.style}
            readOnly={field.readOnly}
            required={field.required}
          />
        </div>
      ))}
      <Button
        variant="terciary"
        style={{ justifyContent: "flex-start", paddingLeft: 0 }}
        disabled={field.disabled}
        onClick={() => {
          const opt: any = item.options;
          opt.push({ id: (item.options.length + 1) * -1, name: "" });
          setItem({ ...item, options: opt });
        }}
      >
        + Añadir opción
      </Button>
    </>
  );
};

const SurveysAdmin = () => {
  const onHideActions = (item: any) => {
    let hoy: any = new Date();
    hoy.setHours(hoy.getHours() - GMT);
    hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const r = { hideEdit: false, hideDel: false };
    if (item?.end_at && new Date(item?.end_at) < hoy) {
      return { hideEdit: true, hideDel: true };
    }
    if (item?.sanswerscount == 0) return { hideEdit: false, hideDel: false };
    if (item?.end_at && new Date(item?.end_at) < new Date())
      return { hideEdit: true, hideDel: true };
    if (item?.begin_at && new Date(item?.begin_at) <= new Date())
      return { hideEdit: false, hideDel: true };
    if (!item?.begin_at) return { hideEdit: true, hideDel: true };
  };
  const mod: ModCrudType = {
    modulo: "surveys",
    singular: "encuesta",
    plural: "encuestas",
    saveMsg: {
      add: "Encuesta creada con éxito",
      edit: "Encuesta actualizada con éxito",
    },
    messageDel: (
      <p>
        ¿Estás seguro de eliminar esta encuesta?
        <br />
        Al momento de eliminarla, los afiliados ya no podrán responder y los
        resultados de esta encuesta se perderán
      </p>
    ),
    permiso: "surveys",
    extraData: true,
    // import: true,
    renderView: (props: {
      open: boolean;
      onClose: any;
      item: Record<string, any>;
      onConfirm?: Function;
      extraData: any;
    }) => <RenderView {...props} />,
    renderForm: (props: {
      item: any;
      setItem: any;
      errors: any;
      extraData: any;
      open: boolean;
      onClose: any;
      user: any;
      execute: any;
      setErrors: any;
      action: any;
    }) => {
      return (
        <RenderForm
          onClose={props.onClose}
          open={props.open}
          item={props.item}
          setItem={props.setItem}
          errors={props.errors}
          extraData={props.extraData}
          user={props.user}
          execute={props.execute}
          setErrors={props.setErrors}
          reLoad={reLoad}
          action={props.action}
        />
      );
    },
    loadView: { fullType: "DET" },
    onHideActions,
    hideActions: { view: true },
  };

  const renderOptions = (data: {
    item: any;
    field: any;
    onChange: any;
    error: any;
    setItem: any;
  }) => {
    const { item, field, onChange, error, setItem } = data;

    if (!item.options) {
      if (
        item.squestions &&
        item.squestions[0] &&
        item.squestions[0].soptions
      ) {
        item.options = item.squestions[0].soptions.map((o: any) => ({
          id: o.id,
          name: o.name,
        }));
      }
    }
    return (
      <>
        <Roptions
          item={item}
          field={field}
          onChange={onChange}
          error={error}
          setItem={setItem}
        />
      </>
    );
  };

  const renderState = (item: any) => {
    let color = "var(--cWhite)";
    let texto = "Vigente";

    let hoy: any = new Date();
    hoy.setHours(hoy.getHours() - GMT);
    hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    // console.log("FECHASSS", item.item?.begin_at, item.item?.end_at);

    if (item.item?.begin_at) {
      color = "var(--cWarning)";
      // texto =
      //   "Programada para el " +
      //   getDateStr(item.item?.begin_at) +
      //   " al " +
      //   getDateStr(item.item?.end_at);
      texto =
        "Activa en " + differenceInDays(hoy, item.item?.begin_at) + " días";
    }
    if (item.item?.begin_at && new Date(item.item?.begin_at) <= hoy) {
      color = "var(--cInfo)";
      texto = "En curso";
    }

    if (item.item?.end_at && new Date(item.item?.end_at) < hoy) {
      color = "var(--cSuccess)";
      texto = "Finalizada";
    }
    return <div style={{ color: color }}>{texto}</div>;
  };

  const renderType = (item: any) => {
    let text = "";
    // if (item.item.is_mandatory == "Y") text = "Obligatoria";
    if (item.item.begin_at && item.item.end_at) text = "Programada";
    if (!item.item.begin_at && !item.item.end_at) text = "Indefinida";

    return (
      <div>
        <p>{text}</p>
        {item.item.is_mandatory == "Y" && (
          <p style={{ color: "var(--cError)", fontSize: "var(--sS)" }}>
            (Obligatoria)
          </p>
        )}
      </div>
    );
  };

  const prepareData = (
    data: any,
    head: any,
    key: string,
    setFormStateForm: Function
  ) => {
    let d = { ...data };

    if (data.id && key == "nresp" && !data.nresp) {
      d = { ...data, nresp: data?.squestions[0].min };
      setFormStateForm((form: any) => {
        return { ...form, nresp: data?.squestions[0].min };
      });
    }
    return d;
  };

  const fields = useMemo(
    () => ({
      id: { rules: [], api: "e" },
      created_at: {
        label: "Fecha",
        list: {
          width: 200,
          onRender: (item: any) => {
            return getDateStrMes(item.value);
          },
        },
      },
      destiny: {
        rules: ["required"],
        api: "ae",
        label: "Destino",
        list: false,
        form: {
          // precarga: "0",
          type: "select",
          // options: lDestinies,
          onLeft: topDestiny,
        },
      },
      is_mandatory: {
        rules: [],
        api: "ae",
        label: "Obligatoria",
        list: false,
        form: {
          onRender: (data: any) => {
            return (
              <>
                <div
                  style={{
                    color: "var(--cWhite)",
                    marginBottom: 4,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  ¿Quieres asegurarte de que todos respondan?
                  <Tooltip
                    position="right"
                    title="Elekta pedirá a los afiliados que respondan esta encuesta antes de permitirles acceder al feed"
                  >
                    <IconInfoApp />
                  </Tooltip>
                </div>
                <div style={{ display: "flex" }}>
                  <Check
                    name="is_mandatory"
                    label="Marcar como Obligatoria"
                    disabled={
                      (data.item.begin_at &&
                        new Date(data.item.begin_at) < new Date()) ||
                      data?.item?.sanswerscount > 0
                    }
                    value={data.item.is_mandatory}
                    checked={data.item.is_mandatory == "Y"}
                    onChange={(e: any) => {
                      const { checked } = e.target;
                      data.onChange({ is_mandatory: checked ? "Y" : "N" });
                    }}
                  />
                </div>
              </>
            );
          },
        },
      },
      switch: {
        rules: [],
        api: "ae",
        list: false,
        form: {
          precarga: "N",
          // onHide: (data: any) => true,
          onRender: programSurvey,
          edit: {
            precarga: (data: any) => {
              return data.data?.begin_at ? "Y" : "N";
            },
          },
        },
      },
      // sublema_id: {
      //   rules: ["required"],
      //   api: "ae",
      //   label: "Sublema",
      //   onHide: isHide,
      //   form: {
      //     type: "select",
      //     optionsExtra: "sublemas",
      //     precarga: user.datos?.sublema_id,
      //     onHide: (data: any) => true,
      //   },
      // },
      // lista_id: {
      //   rules: ["required"],
      //   api: "ae",
      //   label: "Lista",
      //   onHide: isHide,
      //   form: {
      //     type: "select",
      //     optionsExtra: "listas",
      //     precarga: user.datos?.lista_id,
      //     onHide: (data: any) => true,
      //   },
      // },
      begin_at: {
        rules: ["validateIf:switch,Y", "required", "greaterDate"],
        api: "ae",
        label: "Inicio",
        list: false,
        form: {
          onTop: () => {
            return (
              <p style={{ fontSize: 14, color: "var(--cBlackV2)" }}>
                Define el inicio y final de la encuesta para controlar cuándo
                estará disponible para los afiliados
              </p>
            );
          },

          type: "date",
          onHide: (data: any) => !data.item.switch || data.item.switch == "N",
          disabled: (item: any) => {
            let hoy: any = new Date();
            hoy.setHours(hoy.getHours() - GMT);
            hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
            return item?.begin_at && new Date(item?.begin_at) <= hoy;
          },
        },
      },
      end_at: {
        rules: [
          "validateIf:switch,Y",
          "greaterDate",
          "greaterDate:begin_at",
          "required",
        ],
        api: "ae",
        label: "Finalización",
        list: false,
        form: {
          type: "date",
          onHide: (data: any) => !data.item.switch || data.item.switch == "N",
          keyLeft: "begin_at",
          disabled: (item: any) =>
            item.end_at && compareDate(item.end_at, new Date(), "<")
              ? true
              : false,
        },
      },

      name: {
        rules: ["required"],
        api: "ae",
        label: "Título de la encuesta",
        list: true,
        // style: { width: 600 },
        form: {
          label: "Escribe tu pregunta",
          disabled: (item: any) => {
            let hoy: any = new Date();
            hoy.setHours(hoy.getHours() - GMT);
            hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

            return (
              (item?.begin_at && new Date(item?.begin_at) <= hoy) ||
              item?.sanswerscount > 0
            );
          },
          type: "text",
          onTop: () => {
            return (
              <div
                style={{
                  color: "white",
                  fontSize: "var(--sL)",
                  fontWeight: 600,
                  marginBottom: "var(--spXs)",
                }}
              >
                Título de la pregunta
              </div>
            );
          },
        },
      },

      votes: {
        label: "Votos",
        list: {
          width: 180,
          onRender: (item: any) => {
            if (item.item?.sanswerscount == 1)
              return item.item?.sanswerscount + " afiliado votó";
            return item.item?.sanswerscount + " afiliados votaron";
          },
        },
      },
      type: {
        label: "Tipo",
        list: {
          width: "100",
          onRender: renderType,
        },
      },

      state: {
        label: "Estado",
        list: {
          width: 100,
          onRender: renderState,
        },
      },

      // days: {
      //   rules: ["validateIf:switch,N", "required", "number", "required*edit"],
      //   api: "ae",
      //   label: "Días en que se enviará la encuesta",
      //   list: false,

      //   form: {
      //     type: "text",
      //     onHide: (data: any) => data.item.switch && data.item.switch == "Y",
      //   },
      // },

      // nresp: {
      //   rules: ["required", "number", "greater:0"],
      //   api: "ae",
      //   label: "Número de respuestas seleccionables",
      //   list: false,
      //   form: {
      //     type: "number",
      //     prepareData: prepareData,
      //     disabled: (item: any) => {
      //       let hoy: any = new Date();
      //       hoy.setHours(hoy.getHours() - GMT);
      //       hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

      //       return (
      //         (item?.begin_at && new Date(item?.begin_at) <= hoy) ||
      //         item?.sanswerscount > 0
      //       );
      //     },
      //     precarga: "1",
      //     iconRight: (
      //       <Tooltip title="Define la cantidad de opciones que puede escoger el afiliado.">
      //         <IconInfoApp />
      //       </Tooltip>
      //     ),
      //   },
      // },
      options: {
        rules: ["optionSurvey"],
        api: "ae",
        label: "Opciones",
        list: false,
        form: {
          type: "render",
          onRender: renderOptions,
          disabled: (item: any) => {
            let hoy: any = new Date();
            hoy.setHours(hoy.getHours() - GMT);
            hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
            return (
              (item?.begin_at && new Date(item?.begin_at) <= hoy) ||
              item?.sanswerscount > 0
            );
          },
        },
      },
    }),
    []
  );

  const _onChange = (
    e: any,
    item: any,
    setItem: Function,
    setShowExtraModal: Function
  ) => {
    const { name, value } = e.target;
    let selDestinies: any = [];
    if (name.indexOf("destiny_") == 0) {
      const id = parseInt(name.replace("destiny_", ""));
      if (value) {
        setItem({
          ...item,
          lDestiny: [...item.lDestiny, id],
        });
      } else {
        setItem({
          ...item,
          lDestiny: item.lDestiny.filter((d: number) => d != id),
        });
      }
      return true;
    }
    if (name == "destiny") {
      selDestinies = null;
      if (value == 2) selDestinies = extraData.provs;
      if (value == 3) selDestinies = extraData.cantons;
      if (value == 4) selDestinies = extraData.parishes;
      if (value == 5) selDestinies = extraData.barrios;
      if (selDestinies)
        setShowExtraModal(
          <ModalDestiny
            item={{ ...item, destiny: value, lDestiny: [] }}
            setItem={setItem}
            selDestinies={selDestinies}
            setShowExtraModal={setShowExtraModal}
          />
        );
      else setShowExtraModal(null);
    }
    return false;
  };

  const ModalDestiny = ({
    item,
    setItem,
    selDestinies,
    setShowExtraModal,
  }: {
    item: any;
    setItem: Function;
    selDestinies: any;
    setShowExtraModal: Function;
  }) => {
    const [openDestiny, setOpenDestiny] = useState(true);
    const [sel, setSel]: any = useState([]);
    useEffect(() => {
      setSel(item?.lDestiny || []);
    }, [item]);
    return (
      <DataModal
        title="Destino"
        open={openDestiny}
        onClose={() => {
          setOpenDestiny(false);
          setShowExtraModal(null);
        }}
        onSave={() => {
          setItem({ ...item, lDestiny: sel });
          setShowExtraModal(null);
        }}
      >
        <Check
          key={"check0"}
          name={"destiny_0"}
          label="Todos"
          checked={sel.length == 0}
          onChange={(e: any) => {
            const { name, checked } = e.target;
            if (checked) {
              setSel([]);
            }
          }}
          value={0}
          optionValue={["0", "N"]}
        />
        {selDestinies.map((d: any, i: number) => (
          <Check
            key={"check" + i}
            name={"destiny_" + d.id}
            label={d.name}
            checked={sel.includes(d.id)}
            onChange={(e: any) => {
              const { name, checked } = e.target;
              const id: any = parseInt(name.replace("destiny_", ""));

              const il: any = sel?.filter((d: number) => d != id) || [];
              if (checked) {
                il.push(d.id);
              }
              setSel(il);
            }}
            value={d.id}
            optionValue={[d.id, "N"]}
          />
        ))}
      </DataModal>
    );
  };

  const onImport = () => {
    setOpenImport(true);
  };

  const {
    userCan,
    List,
    setStore,
    onSearch,
    searchs,
    onEdit,
    onDel,
    extraData,
    showToast,
    execute,
    reLoad,
    getExtraData,
  } = useCrud({
    paramsInitial,
    mod,
    fields,
    _onChange,
    _onImport: onImport,
  });
  const { onLongPress, selItem, searchState, setSearchState } = useCrudUtils({
    onSearch,
    searchs,
    setStore,
    mod,
    onEdit,
    onDel,
    title: "Encuestas",
  });
  const router: any = useRouter();

  const onResponse = async () => {
    const { data } = await execute("/surveys-automatic", "POST", {});
    if (data?.success) {
      showToast("success", "Se han enviado las encuestas");
    } else {
      showToast("error", "No se han podido enviar las encuestas");
    }
  };
  const [openImport, setOpenImport] = useState(false);
  useEffect(() => {
    setOpenImport(searchState == 3);
  }, [searchState]);

  const onClickDetail = (row: any) => {
    const url = `/detailSurveys?id=${row.id}`;

    window.location.href = url;
  };
  const renderItem = (
    item: Record<string, any>,
    i: number,
    onClick: Function
  ) => {
    return (
      <RenderItem item={item} onClick={onClickDetail} onLongPress={onLongPress}>
        <ItemList
          title={item?.name}
          subtitle={
            "Creado por: " +
            getFullName(item.user) +
            ", en Fecha: " +
            getDateTimeStrMesShort(item.created_at)
          }
          variant="V1"
          left={
            <Avatar
              name={getFullName(item.user)}
              src={getUrlImages(
                "/ADM-" + item.id + "." + item.ext + "?" + item.updated_at
              )}
            />
          }
          active={selItem && selItem.id == item.id}
        />
      </RenderItem>
    );
  };

  if (!userCan(mod.permiso, "R")) return <NotAccess />;
  return (
    <div className={styles.roles}>
      {/* <IconComment onClick={() => onResponse()} /> */}
      <List
        // onTabletRow={renderItem}
        onRowClick={onClickDetail}
        actionsWidth="300px"
      />

      {openImport && (
        <ImportDataModal
          open={openImport}
          onClose={() => {
            setSearchState(0);
            setOpenImport(false);
          }}
          mod={mod}
          showToast={showToast}
          reLoad={reLoad}
          execute={execute}
          getExtraData={getExtraData}
          // requiredCols="DEPARTAMENTO, HABITANTES, HABILITADOS, ESCANOS, CODE"
        />
      )}
    </div>
  );
};

export default SurveysAdmin;
