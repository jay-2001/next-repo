import Dashboard from "@/app/dashboard/dashboard";
import Header from "../header/Header";

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 p-4 pt-20">
                <Dashboard />
            </div>
        </div>
    );
}
