"use client";
import React, { useState } from "react";
import TabsButtons from "@/mk/components/ui/TabsButton/TabsButtons";
import SurveysAdmin from "./SurveysAdmin/SurveysAdmin";
import SurveyDashboard from "./SurveyDashboard/SurveyDashboard";

const Surveys = () => {
  const [typeSearch, setTypeSearch] = useState("A");
  return (
    <div>
      {/* <div>
        <TabsButtons
          tabs={[
            { value: "A", text: "Administrador" },
            // { value: "M", text: "Métricas" },
          ]}
          sel={typeSearch}
          setSel={setTypeSearch}
        />
      </div> */}

      {typeSearch === "A" && <SurveysAdmin />}
      {/* {typeSearch === "M" && <SurveyDashboard />} */}
    </div>
  );
};

export default Surveys;
