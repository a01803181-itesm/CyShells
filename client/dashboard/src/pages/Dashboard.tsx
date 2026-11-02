import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { KpiResumen } from "@/components/dashboard/KpiResumen";
import { RegistrosTable } from "@/components/dashboard/RegistrosTable";
import { TopMetadata } from "@/components/dashboard/TopMetadata";
import AppShell from "@/components/layout/AppShell";

export default function Dashboard() {
    return (
        <AppShell pageTitle="Visión General">
            <div className="flex flex-col w-full animate-in fade-in duration-700 slide-in-from-bottom-4">
                <KpiResumen />
                <DashboardCharts />
                <TopMetadata />
                <RegistrosTable />
            </div>
        </AppShell>
    )
}