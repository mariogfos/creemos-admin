import useScreenSize from "@/mk/hooks/useScreenSize";
import {
  IconComunication,
  IconRedffiliates,
  IconLogout,
  IconNetwork,
  IconCandidates,
  IconDashboard,
} from "../layout/icons/IconsBiblioteca";
import styles from "./mainmenu.module.css";
import MainmenuDropdown from "./MainmenuDropdown";
import MainMenuHeader from "./MainMenuHeader";
import MainmenuItem from "./MainMenuItem";

type PropsType = {
  user?: any;
  client?: any;
  setLogout: any;
  collapsed: boolean;
  setSideBarOpen?: any;
};
const sound = new Audio("/sound/waiting-146636.mp3"); // Crear una instancia de Audio
const MainMenu = ({
  user,
  collapsed,
  setLogout,
  setSideBarOpen,
}: PropsType) => {
  const { isMobile } = useScreenSize();

  const play = () => {
    sound
      .play()
      .catch((err) => console.error("Error al reproducir el audio:", err));
  };

  return (
    <section className={styles.menu}>
      <div>
        <MainMenuHeader user={user} collapsed={collapsed} />
      </div>
      {!isMobile ? (
        <div>
          <MainmenuItem
            href="/"
            label="Panel de control"
            icon={<IconDashboard />}
          />
          <MainmenuItem
            href="/electoralMapping"
            label="Mapeo electoral"
            icon={<IconDashboard />}
          />
          <MainmenuItem
            href="/users"
            label="Administradores"
            icon={<IconDashboard />}
          />
          <MainmenuItem
            href="#"
            label="Roles y permisos"
            icon={<IconDashboard />}
          />
        </div>
      ) : (
        <div>
          <MainmenuItem href="/" label="Eventos" icon={<IconCandidates />} />
        </div>
      )}
      {/* <div>
        <MainmenuItem
          href="#"
          onclick={() => play()}
          label="Reproducir sonido"
          labelColor={"var(--cSuccess)"}
          icon={<></>}
          collapsed={collapsed}
        />
      </div> */}
      <div>
        <MainmenuItem
          href="#"
          onclick={() => setLogout(true)}
          label="Cerrar sesión"
          labelColor={"var(--cError)"}
          icon={<IconLogout color={"var(--cError)"} />}
          collapsed={collapsed}
        />
      </div>
    </section>
  );
};

export default MainMenu;
