import { formatNumber } from "@/mk/utils/numbers";
import Link from "next/link";
import { useRef, useState } from "react";
import styles from "./Maps.module.css";
import {
  paths18Mayo,
  pathsA,
  pathsAcegua,
  pathsAguasCorrientes,
  pathsAigua,
  pathsAnsina,
  pathsArbolito,
  pathsArevalo,
  pathsArtigas,
  pathsAtlantida,
  pathsB,
  pathsBaltasarBrum,
  pathsBarriadaMedina,
  pathsBarriosMontevideo,
  pathsBarrosBlancos,
  pathsBellaUnion,
  pathsC,
  pathsCanelones,
  pathsCardona,
  pathsCarmelo,
  pathsCastillos,
  pathsCasupá,
  pathsCenturión,
  pathsCerroChato,
  pathsCerroDeLasCuentas,
  pathsCerroLargo,
  pathsCH,
  pathsChapicuy,
  pathsChuy,
  pathsCiudadCosta,
  pathsCiudadPlata,
  pathsColonia,
  pathsColoniaLavalleja,
  pathsColoniaNicolich,
  pathsColoniaValdense,
  pathsD,
  pathsDolores,
  pathsDurazno,
  pathsE,
  pathsEcildaPaullier,
  pathsEmpalme,
  pathsF,
  pathsFlorencioSanchez,
  pathsFlores,
  pathsFloresta,
  pathsFlorida,
  pathsFMuerto,
  pathsFray,
  pathsG,
  pathsGarzon,
  pathsGeneral,
  pathsGuichón,
  pathsIsmael,
  pathsIsodoro,
  pathsJoseBattle,
  pathsJoseEnrique,
  pathsJosePedro,
  pathsJuanLacaze,
  pathsLaPaloma,
  pathsLaPaz,
  pathsLaPazCanelones,
  pathsLascano,
  pathsLasCañas,
  pathsLavalle,
  pathsLaValleja,
  pathsLibertad,
  pathsLorenzoGeyres,
  pathsLosCerrillos,
  pathsMaldo,
  pathsMaldonado,
  pathsMariscala,
  pathsMataojo,
  pathsMelo,
  pathsMiguelette,
  pathsMigues,
  pathsMinasCorrales,
  pathsMontes,
  pathsMontevideo,
  pathsMunCanelones,
  pathsNuevaHelvecia,
  pathsNuevaPalmira,
  pathsNuevoBerlin,
  pathsPais,
  pathsPalmitas,
  pathsPanAzucar,
  pathsPando,
  pathsParqueDelPlata,
  pathsPasoCarrasco,
  pathsPasoDeLosToros,
  pathsPaysandu,
  pathsPiedrasColoradas,
  pathsPiriápolis,
  pathsPlácidoRosas,
  pathsPorvenir,
  pathsProgreso,
  pathsPuebloBelén,
  pathsPuntaEste,
  pathsQuebracho,
  pathsRamonTrigo,
  pathsRinconValentin,
  pathsRincón,
  pathsRioNegro,
  pathsRivera,
  pathsRocha,
  pathsRodríguez,
  pathsRosario,
  pathsRíoBranco,
  pathsSalinas,
  pathsSalto,
  pathsSanAntonio,
  pathsSanBautista,
  pathsSanCarlos,
  pathsSanGregorio,
  pathsSanJacinto,
  pathsSanJavier,
  pathsSanJose,
  pathsSanRamon,
  pathsSantaClara,
  pathsSantaLucia,
  pathsSantaRosa,
  pathsSarandi,
  pathsSarandí,
  pathsSauce,
  pathsSoca,
  pathsSolizGrande,
  pathsSolizMataojo,
  pathsSoriano,
  pathsTacuarembo,
  pathsTala,
  pathsTambores,
  pathsTarariras,
  pathsTomasGomensoro,
  pathsTranqueras,
  pathsTreintaTres,
  pathsTresIslas,
  pathsTupambaé,
  pathsVergara,
  pathsVichadero,
  pathsVillaConstitucion,
  pathsVillaDelCarmen,
  pathsYoung,
} from "./pathMapas";

type PropsType = {
  data: any;
  onClick?: any;
  params?: any;
  showBarrios?: any;
  itemSelected: any;
};

const Maps = ({
  data,
  onClick = () => {},
  params = [{}, () => {}],
  itemSelected,
  showBarrios = false,
}: PropsType) => {
  const svgRef: any = useRef(null);
  const [param] = params;

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  let path: any = [];

  if ((param?.level || 1) == 1) {
    path = pathsPais;
  }
  if (param?.level == 2) {
    switch (param?.code) {
      case "Montevideo":
        path = showBarrios ? pathsMontevideo : pathsBarriosMontevideo;
        // path = pathsMontevideo;
        break;
      case "Artigas":
        path = pathsArtigas;
        break;
      case "Canelones":
        path = pathsCanelones;
        break;
      case "Cerro Largo":
        path = pathsCerroLargo;
        break;
      case "Colonia":
        path = pathsColonia;
        break;
      case "Durazno":
        path = pathsDurazno;
        break;
      case "Flores":
        path = pathsFlores;
        break;
      case "Florida":
        path = pathsFlorida;
        break;
      case "Lavalleja":
        path = pathsLaValleja;
        break;
      case "Maldonado":
        path = pathsMaldonado;
        break;
      case "Paysandú":
        path = pathsPaysandu;
        break;
      case "Río Negro":
        path = pathsRioNegro;
        break;
      case "Rivera":
        path = pathsRivera;
        break;
      case "Rocha":
        path = pathsRocha;
        break;
      case "Salto":
        path = pathsSalto;
        break;
      case "San José":
        path = pathsSanJose;
        break;
      case "Soriano":
        path = pathsSoriano;
        break;
      case "Tacuarembó":
        path = pathsTacuarembo;
        break;
      case "Treinta y Tres":
        path = pathsTreintaTres;
        break;
    }
  }
  if (param?.level == 3) {
    switch (param?.code) {
      case "Bella Unión":
        path = pathsBellaUnion;
        break;
      case "Tomás Gomensoro":
        path = pathsTomasGomensoro;
        break;
      case "Baltasar Brum":
        path = pathsBaltasarBrum;
        break;
      case "Villa Constitución":
        path = pathsVillaConstitucion;
        break;
      case "Pueblo Belén":
        path = pathsPuebloBelén;
        break;
      case "Colonia Lavalleja":
        path = pathsColoniaLavalleja;
        break;
      case "Mataojo":
        path = pathsMataojo;
        break;
      case "Rincón de Valentín":
        path = pathsRinconValentin;
        break;
      case "Minas de Corrales":
        path = pathsMinasCorrales;
        break;
      case "Tranqueras":
        path = pathsTranqueras;
        break;
      case "Vichadero":
        path = pathsVichadero;
        break;
      case "Arévalo":
        path = pathsArevalo;
        break;
      case "Piedras Coloradas":
        path = pathsPiedrasColoradas;
        break;
      case "Tupambaé":
        path = pathsTupambaé;
        break;
      case "Melo":
        path = pathsMelo;
        break;
      case "Tres Islas":
        path = pathsTresIslas;
        break;
      case "Cerro de las Cuentas":
        path = pathsCerroDeLasCuentas;
        break;
      case "Fraile Muerto":
        path = pathsFMuerto;
        break;
      case "Ramón Trigo":
        path = pathsRamonTrigo;
        break;
      case "Barriada de Medina":
        path = pathsBarriadaMedina;
        break;
      case "Arbolito":
        path = pathsArbolito;
        break;
      case "Aceguá":
        path = pathsAcegua;
        break;
      case "Isidoro Noblía":
        path = pathsIsodoro;
        break;
      case "Centurión":
        path = pathsCenturión;
        break;
      case "Las Cañas":
        path = pathsLasCañas;
        break;
      case "Plácido Rosas":
        path = pathsPlácidoRosas;
        break;
      case "Río Branco":
        path = pathsRíoBranco;
        break;
      case "Paso de los Toros":
        path = pathsPasoDeLosToros;
        break;
      case "San Gregorio":
        path = pathsSanGregorio;
        break;
      case "Ansina":
        path = pathsAnsina;
        break;
      case "Chapicuy":
        path = pathsChapicuy;
        break;
      case "Quebracho":
        path = pathsQuebracho;
        break;
      case "Lorenzo Geyres":
        path = pathsLorenzoGeyres;
        break;
      case "Porvenir":
        path = pathsPorvenir;
        break;
      case "Guichón":
        path = pathsGuichón;
        break;
      case "Tambores":
        path = pathsTambores;
        break;
      case "San Javier":
        path = pathsSanJavier;
        break;
      case "Young":
        path = pathsYoung;
        break;
      case "Nuevo Berlín":
        path = pathsNuevoBerlin;
        break;
      case "Villa del Carmen":
        path = pathsVillaDelCarmen;
        break;
      case "Sarandí del Yí":
        path = pathsSarandí;
        break;
      case "Cerro Chato":
        path = pathsCerroChato;
        break;
      case "Santa Clara del Olimar":
        path = pathsSantaClara;
        break;
      case "General Enrique Martínez (Charqueada)":
        path = pathsGeneral;
        break;
      case "Vergara":
        path = pathsVergara;
        break;
      case "Rincón":
        path = pathsRincón;
        break;
      case "La Paloma":
        path = pathsLaPaloma;
        break;
      case "Castillos":
        path = pathsCastillos;
        break;
      case "Chuy":
        path = pathsChuy;
        break;
      case "Solís de Mataojo":
        path = pathsSolizMataojo;
        break;
      case "Mariscala":
        path = pathsMariscala;
        break;
      case "José Batlle y Ordóñez":
        path = pathsJoseBattle;
        break;
      case "José Pedro Varela":
        path = pathsJosePedro;
        break;
      case "Sarandí Grande":
        path = pathsSarandi;
        break;
      case "Fray Marcos":
        path = pathsFray;
        break;
      case "Casupá":
        path = pathsCasupá;
        break;
      case "Ismael Cortinas":
        path = pathsIsmael;
        break;
      case "Dolores":
        path = pathsDolores;
        break;
      case "Palmitas":
        path = pathsPalmitas;
        break;
      case "José Enrique Rodó":
        path = pathsJoseEnrique;
        break;
      case "Cardona":
        path = pathsCardona;
        break;
      case "Lascano":
        path = pathsLascano;
        break;
      case "Solis Grande":
        path = pathsSolizGrande;
        break;
      case "Piriápolis":
        path = pathsPiriápolis;
        break;
      case "Pan de Azúcar":
        path = pathsPanAzucar;
        break;
      case "Punta del Este":
        path = pathsPuntaEste;
        break;
      case "San Carlos":
        path = pathsSanCarlos;
        break;
      case "Maldonado":
        path = pathsMaldo;
        break;
      case "Garzón":
        path = pathsGarzon;
        break;
      case "Aiguá":
        path = pathsAigua;
        break;
      case "Nueva Palmira":
        path = pathsNuevaPalmira;
        break;
      case "Carmelo":
        path = pathsCarmelo;
        break;
      case "Ombúes de Lavalle":
        path = pathsLavalle;
        break;
      case "Miguelete":
        path = pathsMiguelette;
        break;
      case "Florencio Sánchez":
        path = pathsFlorencioSanchez;
        break;
      case "Tarariras":
        path = pathsTarariras;
        break;
      case "Juan Lacaze":
        path = pathsJuanLacaze;
        break;
      case "Rosario":
        path = pathsRosario;
        break;
      case "La paz":
        path = pathsLaPaz;
        break;
      case "Nueva Helvecia":
        path = pathsNuevaHelvecia;
        break;
      case "Nueva Helvecia":
        path = pathsNuevaHelvecia;
        break;
      case "Colonia Valdense":
        path = pathsColoniaValdense;
        break;
      case "Ecilda Paullier":
        path = pathsEcildaPaullier;
        break;
      case "Libertad":
        path = pathsLibertad;
        break;
      case "Ciudad del Plata":
        path = pathsCiudadPlata;
        break;
      case "Rodríguez":
        path = pathsRodríguez;
        break;
      case "Santa Lucía":
        path = pathsSantaLucia;
        break;
      case "San Ramón":
        path = pathsSanRamon;
        break;
      case "Tala":
        path = pathsTala;
        break;
      case "Los Cerrillos":
        path = pathsLosCerrillos;
        break;
      case "Aguas Corrientes":
        path = pathsAguasCorrientes;
        break;
      case "Canelones":
        path = pathsMunCanelones;
        break;
      case "San Antonio":
        path = pathsSanAntonio;
        break;
      case "San Bautista":
        path = pathsSanBautista;
        break;
      case "La Paz":
        path = pathsLaPazCanelones;
        break;
      case "18 de Mayo":
        path = paths18Mayo;
        break;
      case "Progreso":
        path = pathsProgreso;
        break;
      case "Sauce":
        path = pathsSauce;
        break;
      case "Santa Rosa":
        path = pathsSantaRosa;
        break;
      case "Paso Carrasco":
        path = pathsPasoCarrasco;
        break;
      case "Ciudad de la Costa":
        path = pathsCiudadCosta;
        break;
      case "Colonia Nicolich":
        path = pathsColoniaNicolich;
        break;
      case "Pando":
        path = pathsPando;
        break;
      case "Barros Blancos":
        path = pathsBarrosBlancos;
        break;
      case "Suárez":
        path = pathsBarrosBlancos;
        break;
      case "Salinas":
        path = pathsSalinas;
        break;
      case "Empalme Olmos":
        path = pathsEmpalme;
        break;
      case "San Jacinto":
        path = pathsSanJacinto;
        break;
      case "Atlántida":
        path = pathsAtlantida;
        break;
      case "Parque del Plata":
        path = pathsParqueDelPlata;
        break;
      case "La Floresta":
        path = pathsFloresta;
        break;
      case "Soca":
        path = pathsSoca;
        break;
      case "Migues":
        path = pathsMigues;
        break;
      case "Montes":
        path = pathsMontes;
        break;
      case "A":
        path = pathsA;
        break;
      case "G":
        path = pathsG;
        break;
      case "B":
        path = pathsB;
        break;
      case "C":
        path = pathsC;
        break;
      case "D":
        path = pathsD;
        break;
      case "CH":
        path = pathsCH;
        break;
      case "E":
        path = pathsE;
        break;
      case "F":
        path = pathsF;
        break;
    }
  }

  const _onClick = (code: string | number) => {
    if (!showBarrios) return;
    let row = data?.find((d: any) => d.name == code);
    onClick(row);
  };

  let paramLevel = param?.level == undefined ? 1 : param?.level;

  const onTooltip = (event: any, id: string | number, show: boolean = true) => {
    if (!show) return setTooltip({ visible: false, x: 0, y: 0, item: null });
    const rect = event.target.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();
    const item = data?.find((d: any) => d.name == id) || {
      id: id || itemSelected?.id,
      name: itemSelected?.name || "Sin municipio",
      habitantes: itemSelected?.habitantes || 0,
      habilitados: itemSelected?.habilitados || 0,
      afiliados: itemSelected?.affiliate_count || 0,
      municipios: itemSelected?.municipios || 0,
      // total: 0,
    };

    setTooltip({
      visible: (id || item != null) && showBarrios ? true : false,
      x: rect.left - svgRect.left + rect.width / 2,
      y: rect.top - svgRect.top,
      item: paramLevel <= 2 ? item : null,
    });
  };

  const getStyle = () => {
    switch (param?.code) {
      case "Montevideo":
        return styles.CerroLargoMap;
      case "Artigas":
        return styles.CerroLargoMap;
      case "Canelones":
        return styles.CañarMap;
      case "Cerro Largo":
        return styles.CerroLargoMap;
      case "Colonia":
        return styles.CotopaxiMap;
      case "Durazno":
        return styles.ChimborazoMap;
      case "Flores":
        return styles.ElOroMap;
      case "Florida":
        return styles.SaltoMap;
      case "Lavalleja":
        return styles.GuayasMap;
      case "Maldonado":
        return styles.ImbaduraMap;
      case "Paysandú":
        return styles.LojaMap;
      case "Río Negro":
        return styles.DuraznoMap;
      case "Rivera":
        return styles.ManabiMap;
      case "Rocha":
        return styles.MoronaMap;
      case "Salto":
        return styles.NapoMap;
      case "San José":
        return styles.PastazaMap;
      case "Soriano":
        return styles.PichinchaMap;
      case "Tacuarembó":
        return styles.TunguaruMap;
      case "Treinta y Tres":
        return styles.ZamoraMap;
      case "Bella Unión":
        return styles.BellaUnionMap;
      default:
        return styles.mapa;
    }
  };

  const Tooltip = ({ item }: any) => {
    return (
      paramLevel <= 2 && (
        <div
          className={styles.tooltip}
          style={{
            top: tooltip.y,
            left: tooltip.x,
            borderRadius: 4,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          <h3 style={{ fontSize: 16, color: "#101111", paddingBottom: 8 }}>
            {item?.name?.charAt(0).toUpperCase() +
              item?.name?.slice(1).toLowerCase()}
          </h3>
          <div style={{ fontSize: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#656F78",
              }}
            >
              <p>Habitantes: </p>
              <p style={{ color: "#101111" }}>
                {formatNumber(item?.habitantes, 0)}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#656F78",
              }}
            >
              <p>Votantes habilitados: </p>
              <p style={{ color: "#101111" }}>
                {formatNumber(item?.habilitados, 0)}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#656F78",
              }}
            >
              <p>Afiliados: </p>
              <p style={{ color: "#101111" }}>
                {formatNumber(item?.affiliate_count || item?.afiliados, 0)}
              </p>
            </div>
            {param?.level == 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#656F78",
                }}
              >
                <p>Municipios: </p>
                <p style={{ color: "#101111" }}>
                  {formatNumber(item?.distritosCount || item?.distritos, 0)}
                </p>
              </div>
            )}
          </div>
        </div>
      )
    );
  };

  return (
    <div className={param?.level == 1 ? styles.mapa : getStyle()}>
      <svg ref={svgRef} viewBox={path[0]?.vb}>
        {path.map((path: any, index: number) => {
          if (path.title === "rect") {
            return (
              <rect
                key={path.id || index}
                x={path.x}
                y={path.y}
                width={path.width}
                height={path.height}
                rx={path.rx}
                style={{ fill: "#fff" }}
              />
            );
          }

          return (
            <Link
              key={path.id || index}
              href="#"
              onClick={() =>
                path.title !== "map" &&
                path.title !== "line" &&
                path.title !== "salar" &&
                param?.level != 3 &&
                path.title !== "disabled" &&
                path.code
                  ? _onClick(path?.code)
                  : {}
              }
              title={path.title}
            >
              <path
                key={path.id || index}
                style={{
                  fill: path.title === "salar" ? "#393c3f" : "",
                  strokeWidth:
                    path.title === "salar"
                      ? 0
                      : paramLevel === 2
                      ? !showBarrios
                        ? 2
                        : 0.4
                      : paramLevel === 3
                      ? 0.1
                      : 1,
                  stroke:
                    path.title === "value"
                      ? "#000"
                      : path.title === "line"
                      ? "#fff"
                      : "",
                  cursor:
                    param?.level < 3 && path.title !== "salar" && showBarrios
                      ? "pointer"
                      : "default",
                }}
                d={path.d}
                onMouseEnter={(e) =>
                  path.title !== "salar" && onTooltip(e, path?.code)
                }
                onMouseLeave={() =>
                  path.title !== "salar" && onTooltip(null, path?.code, false)
                }
              />
            </Link>
          );
        })}
      </svg>

      {tooltip.visible && (
        <Tooltip
          x={tooltip.x}
          y={tooltip.y}
          item={tooltip.item}
          param={param}
        />
      )}
    </div>
  );
};

export default Maps;
