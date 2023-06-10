import { Provider as SocketProvider } from "@/socket/context";
import ProjectsScreen from "~/modules/projects/screens";

export default function ProjectsPage() {
  return (
    <SocketProvider>
      <ProjectsScreen />
    </SocketProvider>
  );
}
