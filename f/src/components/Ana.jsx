import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, Link } from "react-router"
import { useBreadcrumb } from "@/hooks/use-breadcrumb"

export default function Ana({ onSignOut }) {
    const breadcrumbs = useBreadcrumb();
    
    return (
        <>
          <SidebarProvider>
          <AppSidebar onSignOut={onSignOut} />
          <SidebarInset>
            <header className="flex h-8 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {/* <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.path}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb> */}
            </header>
            <div className="flex flex-1  flex-col gap-4 p-2 max-w-full overflow-x-hidden bg-slate-100 ">
              {/* Root Routes bileşeni yerine direkt sayfaları Outlet aracılığıyla görüntüleyelim */}
              <Outlet />            </div>
          </SidebarInset>
        </SidebarProvider>
        </>
      );
}

