// Asumo que este archivo está en una ruta como: app/carnet-simpatizante/[id]/page.tsx

import InvitedRegistration from "@/modulos/InvitedRegistration/InvitedRegistration";
import React from "react";

const page = ({ params }: { params: { id: string } }) => {
  return <InvitedRegistration id={params.id} />;
};

export default page;