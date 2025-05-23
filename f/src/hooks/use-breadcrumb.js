import { useLocation } from "react-router";

// Rota yapılandırması - uygulama genişledikçe bunu genişletebilirsiniz
const routes = {
  "/": { label: "Ana Sayfa", path: "/" },
  "/dashboard": { label: "Dashboard", path: "/" },
  "/musteriekle": { label: "Müşteri Ekle", path: "/musteriekle" },
  "/musterilistesi": { label: "Müşteri Listesi", path: "/musterilistesi" },
  "/bayiekle": { label: "Bayi Ekle", path: "/bayiekle" },
  "/bayilistesi": { label: "Bayi Listesi", path: "/bayilistesi" },
//   "/ozelbayilistesi": { label: "Özel Bayi Listesi", path: "/bayilistesi/ozelbayilistesi" },
};

export function useBreadcrumb() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Path parçalarını alıp breadcrumb için uygun hale getir
  const pathSegments = currentPath.split('/')
    .filter(segment => segment !== '');
  
  // Tüm rota parçalarının toplamını breadcrumb olarak oluştur
  const breadcrumbs = [routes["/"]]
    .concat(
      pathSegments.map((segment, index) => {
        const path = `/${segment}`;
        return {
          label: routes[path]?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
          path: path
        };
      })
    );
  
  return breadcrumbs;
}