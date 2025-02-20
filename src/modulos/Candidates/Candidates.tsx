"use client";
import styles from "./Candidates.module.css";
import RenderItem from "../shared/RenderItem";
import useCrudUtils from "../shared/useCrudUtils";
import { useEffect, useMemo, useState } from "react";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import NotAccess from "@/components/layout/NotAccess/NotAccess";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import RenderView from "./RenderView";
import { lIdeologies } from "@/mk/utils/utils";
import { useAuth } from "@/mk/contexts/AuthProvider";

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

let levelCand = [
  { id: "0", name: "Partido - no aparece en mapa" },
  { id: "1", name: "Candidato Nacional" },
  { id: "2", name: "Candidato Departamental" },
  { id: "3", name: "Candidato Municipal" },
];

const Candidates = () => {
  const { user } = useAuth();
  const mod: ModCrudType = {
    modulo: "candidates",
    singular: "candidato",
    plural: "candidatos",
    permiso: "",
    onHideActions: (item: any) => {
      return {
        hideEdit: user?.role?.level >= 3,
        hideDel: user?.role?.level >= 3,
      };
    },
    // import: true,
    renderView: (props: {
      open: boolean;
      onClose: any;
      item: Record<string, any>;
      onConfirm?: Function;
      extraData?: Record<string, any>;
    }) => <RenderView {...props} />,
    extraData: true,
  };

  const OnTop = ({ title, subtitle }: any) => {
    return (
      <div>
        <p className={styles.title}>{title}</p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    );
  };
  const rigth = (data: {
    key: string;
    user?: Record<string, any>;
    item: Record<string, any>;
  }) => {
    if (!data.item.id) return null;
    return (
      <iframe
        src={getUrlImages(
          "/PLAN-" + data.item.id + ".pdf?d=" + data.item.updated_at
        )}
        width="100%"
        height="100%"
        title={data.item.name}
      ></iframe>
    );
  };

  const isHidenMun = (data: {
    key: string;
    user?: Record<string, any>;
    item: Record<string, any>;
  }) => {
    if (data.item.level == "3") return false;

    return true;
  };
  const isHidenDpto = (data: {
    key: string;
    user?: Record<string, any>;
    item: Record<string, any>;
  }) => {
    if (data.item.level == "2" || data.item.level == "3") return false;

    return true;
  };

  const fields = useMemo(() => {
    return {
      id: { rules: [], api: "e" },
      avatar: {
        rules: ["required*add"],
        api: "a*e*",
        label: "Suba una imagen",
        list: false,
        form: {
          type: "imageUpload",
          prefix: "CAND",
          onTop: () => {
            return (
              <OnTop
                title="Perfil"
                subtitle="Agrega una foto de perfil para el candidato"
              />
            );
          },
          style: { width: "100%" },
        },
      },
      portada: {
        rules: ["required*add"],
        api: "a*e*",
        label: "Suba una imagen",
        list: false,
        form: {
          type: "imageUpload",
          prefix: "PCAND",
          editor: { width: 720, height: 200 },
          sizePreview: { width: "360px", height: "100px" },
          // onRigth: rigth,
          onTop: () => {
            return (
              <OnTop
                title="Portada"
                subtitle="Agrega una foto de portada para el candidato"
              />
            );
          },
          style: { width: "100%" },
        },
      },
      status: {
        rules: ["required"],
        api: "ae",
        label: "Estado",
        // style: { width: 210 },
        list: {
          width: "140",
        },
        form: {
          onTop: () => {
            return (
              <OnTop
                title="Estado"
                subtitle="Hablita y deshabilita a los candiadtos"
              />
            );
          },
          type: "select",
          options: [
            { id: "A", name: "Habilitado" },
            { id: "X", name: "Deshabilitado" },
          ],
        },
      },
      level: {
        rules: ["required"],
        api: "ae",
        label: "Nivel de candidatura",
        form: {
          type: "select",
          options: levelCand,
          onTop: () => {
            return (
              <OnTop
                title="Nivel de candidatura"
                subtitle="Escoge nivel de candidatura para el candidato"
              />
            );
          },
        },
        list: {
          order: 2,
          options: ({ item, extraData }: any) => {
            let levelCandid = [];

            if (item?.item?.level == 0) {
              levelCandid.push({ id: "0", name: "Partido" });
            }
            const lLevel = levelCand[item?.item?.level]?.name;
            if (item?.item?.level == 1) {
              levelCandid.push({ id: "1", name: lLevel });
            }
            if (item?.item?.level == 2) {
              levelCandid.push({
                id: "2",
                name:
                  lLevel +
                  " - " +
                  extraData.dptos.find((e: any) => e.id == item?.item?.dpto_id)
                    .name,
              });
            }
            if (item?.item?.level > 2) {
              levelCandid.push({ id: item?.item?.level, name: lLevel });
            }
            return levelCandid;
          },
        },
      },
      dpto_id: {
        rules: ["requiredIf:level,2", "requiredIf:level,3"],
        onHide: isHidenDpto,
        api: "ae",
        label: "Departamento",
        form: {
          type: "select",
          optionsExtra: "dptos",
          onTop: () => {
            return (
              <OnTop
                title="Departamento "
                subtitle="Selecciona la departamento a la que pertenece el candidato"
              />
            );
          },
        },
        // style: { width: "300px" },
        list: false,
      },
      mun_id: {
        rules: ["requiredIf:level,3"],
        onHide: isHidenMun,
        api: "ae",
        label: "Municipio",
        form: {
          type: "select",
          optionsExtra: "muns",
          onTop: () => {
            return (
              <OnTop
                title="Municipio "
                subtitle="Selecciona el municipio a la que pertenece el candidato"
              />
            );
          },
        },
        // style: { width: "300px" },
        list: false,
      },
      position: {
        rules: ["required"],
        api: "ae",
        label: "Posición en la lista",
        form: {
          type: "number",
          onTop: () => {
            return (
              <OnTop
                title="Posición en la lista"
                subtitle="Indica la posición del candidato en la lista"
              />
            );
          },
        },
        list: false,
      },
      fullName: {
        // rules: ["required"],
        api: "ae",
        label: "Nombre del candidato",
        form: false,
        onRender: (item: any) => {
          return getFullName(item?.item);
        },
        list: true,
      },
      nickname: {
        rules: ["required"],
        api: "ae",
        label: "Nombre de Elekta",
        form: {
          type: "text",
          onTop: () => {
            return (
              <OnTop
                title="Nombre de Elekta"
                subtitle="Este podría ser el nombre o un apodo del candidato"
              />
            );
          },
        },
        list: false,
      },
      name: {
        rules: ["required"],
        api: "ae",
        label: "Primer nombre",
        form: {
          type: "text",
          onTop: () => {
            return (
              <OnTop
                title="Información personal"
                subtitle="Introduce los datos personales para generar mayor confianza a sus seguidores"
              />
            );
          },
        },
        list: false,
      },
      middle_name: {
        rules: [""],
        api: "ae",
        label: "Segundo nombre (opcional)",
        form: { type: "text" },
        list: false,
      },
      last_name: {
        rules: ["required"],
        api: "ae",
        label: "Apellido paterno",
        form: { type: "text" },
        list: false,
      },
      mother_last_name: {
        rules: [""],
        api: "ae",
        label: "Apellido materno (opcional)",
        form: { type: "text" },
        list: false,
      },

      typecand_id: {
        rules: ["required"],
        api: "ae",
        label: "Tipo de candidato",
        form: {
          type: "select",
          // optionsExtra: "typeCands",
          options: ({ extraData, item }: any) => {
            let data: any = [];
            extraData?.typeCands.map((c: any) => {
              if (c.status == "A") {
                data.push({
                  id: c.id,
                  name: c?.name,
                });
              }
            });
            return data;
          },
        },
        list: {
          width: "200px",
          optionsExtra: "typeCands",
        },
      },
      profession: {
        rules: ["required"],
        api: "ae",
        label: "Profesión",
        form: { type: "text" },
        list: false,
      },
      born: {
        rules: ["required"],
        api: "ae",
        label: "Lugar de nacimiento",
        form: { type: "text" },
        list: false,
      },
      facebook: {
        rules: ["facebook"],
        api: "ae",
        label: "Facebook",
        form: {
          type: "text",
          onTop: () => (
            <OnTop
              title="Redes sociales"
              subtitle="Agrega los enlaces de las redes sociales del candidato para que sus seguidores puedan seguirlo"
            />
          ),
        },
        list: false,
      },
      twitter: {
        rules: ["twitter"],
        api: "ae",
        label: "Twitter",
        form: { type: "text" },
        list: false,
      },
      instagram: {
        rules: ["instagram"],
        api: "ae",
        label: "Instagram",
        form: { type: "text" },
        list: false,
      },
      linkedin: {
        rules: ["linkedin"],
        api: "ae",
        label: "Linkedin",
        form: { type: "text" },
        list: false,
      },
      title: {
        rules: ["required"],
        api: "ae",
        label: "Presentación",
        form: {
          type: "text",
          onTop: () => {
            return (
              <OnTop
                title="Presentación"
                subtitle="Redacta una breve presentación del candidato/ Ej: Candidato a presidente de la república de “País”"
              />
            );
          },
        },
        list: false,
      },
      ideology: {
        rules: [""],
        api: "ae",
        label: "Ideología Política",
        form: {
          type: "select",
          options: lIdeologies,
          onTop: () => {
            return (
              <OnTop
                title="Ideología Política"
                subtitle="Escoge la ideología más afín al candidato"
              />
            );
          },
        },
        list: false,
      },
      biography: {
        rules: ["required"],
        api: "ae",
        label: "Biografía",
        form: {
          type: "textArea",
          lines: 6,
          onTop: () => {
            return (
              <OnTop
                title="Biografía"
                subtitle="Escribe un poco de la historia del candidato para que sus seguidores lo conozcan mejor"
              />
            );
          },
        },
        list: false,
      },
      experience: {
        rules: ["required"],
        api: "ae",
        label: "Experiencia política",
        form: {
          type: "textArea",
          lines: 6,
          onTop: () => {
            return (
              <OnTop
                title="Experiencia política"
                subtitle="Comparte la trayectoria del candidato para demostrar que es el candidato ideal"
              />
            );
          },
        },

        list: false,
      },
      plan: {
        rules: ["required*add"],
        api: "ae",
        label: "Plan de gobierno",
        form: {
          type: "fileUpload",
          ext: ["pdf"],
          onRigth: rigth,
          onTop: () => {
            return (
              <OnTop
                title="Plan de gobierno"
                subtitle="Describe las soluciones y proyectos que empleará el candidato para atraer a sus seguidores"
              />
            );
          },
          style: { width: "100%" },
        },
        list: false,
      },
    };
  }, []);

  const onImport = () => {
    setOpenImport(true);
  };

  const { userCan, List, setStore, onSearch, searchs, onEdit, onDel } = useCrud(
    {
      paramsInitial,
      mod,
      fields,
      _onImport: onImport,
    }
  );
  const { onLongPress, selItem, searchState, setSearchState } = useCrudUtils({
    onSearch,
    searchs,
    setStore,
    mod,
    onEdit,
    onDel,
  });

  const [openImport, setOpenImport] = useState(false);
  useEffect(() => {
    setOpenImport(searchState == 3);
  }, [searchState]);

  const renderItem = (
    item: Record<string, any>,
    i: number,
    onClick: Function
  ) => {
    return (
      <RenderItem item={item} onClick={onClick} onLongPress={onLongPress}>
        <ItemList
          title={item?.name}
          subtitle={item?.description}
          variant="V1"
          active={selItem && selItem.id == item.id}
        />
      </RenderItem>
    );
  };

  if (!userCan(mod.permiso, "R")) return <NotAccess />;
  return (
    <div className={styles.candidates}>
      <List onTabletRow={renderItem} />
    </div>
  );
};

export default Candidates;
