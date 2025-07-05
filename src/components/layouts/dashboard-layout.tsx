import { AppSidebar } from "../app-sidebar";
import { Separator } from "../ui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";

export type DashboardProps = {
  title: string;
  children: React.ReactNode;
  header?: React.ReactNode;
};

export function DashboardLayout({ title, children, header }: DashboardProps) {
  return (
    <>
      <title>{`${title} - Toolbox`}</title>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              {header}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-3 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
