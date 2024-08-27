import Dashboard from "@/app/dashboard/dashboard"
import SideNavbar from "@/components/SideNavbar"
import Header from "../header/Header";

export default function DashboardPage() {
  return (
      <div>
          <Header />
          <div className="flex">
              <Dashboard />
          </div>
      </div>
  );
}
