"use client";
import { useState } from "react";
import TabsButtons from "@/mk/components/ui/TabsButton/TabsButtons";
import Levels from "@/modulos/Levels/Levels";
import Medals from "@/modulos/Medals/Medals";
import Leagues from "@/modulos/Leagues/Leagues";
import GameActions from "@/modulos/GameActions/GameActions";

const Gamification = () => {
  const [typeSearch, setTypeSearch] = useState("L");
  return (
    <div>
      <div>
        <TabsButtons
          tabs={[
            { value: "L", text: "Ligas" },
            { value: "N", text: "Niveles" },
            { value: "I", text: "Insignias" },
            { value: "A", text: "Acciones" },
          ]}
          sel={typeSearch}
          setSel={setTypeSearch}
        />
      </div>
      {typeSearch === "L" && <Leagues />}
      {typeSearch === "N" && <Levels />}
      {typeSearch === "I" && <Medals />}
      {typeSearch === "A" && <GameActions />}
    </div>
  );
};

export default Gamification;
