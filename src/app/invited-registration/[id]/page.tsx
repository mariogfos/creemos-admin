// src/app/invited-registration/[id]/page.tsx

import InvitedRegistration from '@/modulos/InvitedRegistration/InvitedRegistration';

export default async function InvitedRegistrationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <InvitedRegistration id={id} />
    </div>
  );
}
