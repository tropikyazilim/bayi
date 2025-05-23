import Ana from "./components/Ana";
import Root from "./pages/Root";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import BayiEkle from "./pages/Bayiler/BayiEkle/Bayiekle";
import Dashboard from "./pages/Dashboard";
import BayiListesi from "./pages/Bayiler/BayiListesi/BayiListesi";
import MusteriEkle from "./pages/Musteriler/MusteriEkle/MusteriEkle";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import MusteriListesi from "./pages/Musteriler/MusteriListesi/MusteriListesi";
import Ayarlar from "./pages/Ayarlar";
import MusteriDashboard from "./pages/Musteriler/MusteriDashboard";
import MusteriDuzenle from "./pages/Musteriler/MusteriDuzenle";
import PaketEkle from "./pages/Paketler/PaketEkle/PaketEkle";
import PaketListesi from "./pages/Paketler/PaketListesi/PaketListesi";
import BayiDuzenle from "./pages/Bayiler/BayiDuzenle";
import ModulListesi from "./pages/Moduller/ModulListesi/ModulListesi";
import ModulEkle from "./pages/Moduller/ModulEkle/ModulEkle";
import ModulDuzenle from "./pages/Moduller/ModulDuzenle";
import PaketDuzenle from "./pages/Paketler/PaketDuzenle";
import LisansEkle from "./pages/Lisanslar/LisansEkle/LisansEkle";
import LisansListesi from "./pages/Lisanslar/LisansListesi/LisansListesi";
import LisansDuzenle from "./pages/Lisanslar/LisansDuzenle";
import { Toaster } from "sonner";
import DemoEkle from "./pages/Demolar/DemoEkle/DemoEkle";
import DemoListesi from "./pages/Demolar/DemoListesi/DemoListesi";
import DemoDuzenle from "./pages/Demolar/DemoDuzenle";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <Dashboard /> },

      { path: "lisansekle", element: <LisansEkle /> },
      { path: "lisanslistesi", element: <LisansListesi /> },
      { path: "lisansduzenle/:id", element: <LisansDuzenle /> },

      { path: "musteriekle", element: <MusteriEkle /> },
      { path: "musterilistesi", element: <MusteriListesi /> },
      { path: "musteri/:id", element: <MusteriDashboard /> },
      { path: "musteriduzenle/:id", element: <MusteriDuzenle /> },

      { path: "bayiekle", element: <BayiEkle /> },
      { path: "bayilistesi", element: <BayiListesi /> },
      { path: "bayiduzenle/:id", element: <BayiDuzenle /> },

      { path: "paketekle", element: <PaketEkle /> },
      { path: "paketlistesi", element: <PaketListesi /> },
      { path: "paketduzenle/:id", element: <PaketDuzenle /> },

      { path: "modulekle", element: <ModulEkle /> },
      { path: "modullistesi", element: <ModulListesi /> },
      { path: "modulduzenle/:id", element: <ModulDuzenle /> },

      { path: "demoekle", element: <DemoEkle /> },
      { path: "demolistesi", element: <DemoListesi /> },
      { path: "demoduzenle/:id", element: <DemoDuzenle /> },

      { path: "ayarlar", element: <Ayarlar /> },
    ],
  },
]);

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}

export default App;
