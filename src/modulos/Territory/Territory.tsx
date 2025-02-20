"use client";
import TabsButtons from "@/mk/components/ui/TabsButton/TabsButtons";
import React, { useState } from "react";
import Sublemas from "../Sublemas/Sublemas";
import Listas from "../Listas/Listas";
import Locals from "../Locals/Locals";
import Dptos from "../Dptos/Dptos";
import Barrios from "../Barrios/Barrios";
import Muns from "../Muns/Muns";

const Territory = () => {
  const [typeSearch, setTypeSearch] = useState("L");
  return (
    <div>
      <TabsButtons
        tabs={[
          // { value: "S", text: "Sublemas" },
          { value: "L", text: "Organización" },
          { value: "D", text: "Departamentos" },
          { value: "M", text: "Municipios" },
          // { value: "O", text: "Localidades" },
          // { value: "A", text: "Afiliados" },
          { value: "B", text: "Barrios" },
        ]}
        sel={typeSearch}
        setSel={setTypeSearch}
      />

      {/* {typeSearch === "S" && <Sublemas />} */}
      {typeSearch === "L" && <Listas />}
      {typeSearch === "D" && <Dptos />}
      {typeSearch === "M" && <Muns />}
      {/* {typeSearch === "O" && <Locals />} */}
      {typeSearch === "B" && <Barrios />}
      {/* {typeSearch === "A" && <Afiliados />} */}
      {/* {typeSearch === "C" && <Candidates />} */}
    </div>
  );
};

export default Territory;
