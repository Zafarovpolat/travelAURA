import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { AdminEditor } from "@/components/admin/AdminEditor";

export const metadata: Metadata = {
  title: "travelAURA — редактор",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <Landing admin />
      <AdminEditor />
    </>
  );
}
