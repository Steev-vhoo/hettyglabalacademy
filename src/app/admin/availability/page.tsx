import { getSettings } from "@/lib/booking";
import { AdminHeader } from "../ui";
import { AvailabilityForm } from "./AvailabilityForm";

export const metadata = { title: "Availability" };

export default async function AvailabilityPage() {
  const s = await getSettings();
  return (
    <>
      <AdminHeader title="Availability" intro="Set when clients can book consultations. Times are in your timezone; clients see them in theirs." />
      <AvailabilityForm settings={s} />
    </>
  );
}
