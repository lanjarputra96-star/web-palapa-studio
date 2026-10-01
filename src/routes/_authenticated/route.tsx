import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { adminMe } from "@/lib/content.functions";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { username } = await adminMe();
    if (!username) throw redirect({ to: "/auth" });
    return { username };
  },
  component: () => <Outlet />,
});
