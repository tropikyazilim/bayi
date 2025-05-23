import * as React from "react";
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react";
import { NavLink, Link } from "react-router-dom"; // "react-router" yerine "react-router-dom" kullanın
import { useState, useEffect, useMemo } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { SearchForm } from "@/components/search-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { SignIn } from "@clerk/clerk-react";
import { neobrutalism } from "@clerk/themes";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

// Türkçe karakterleri doğru şekilde küçük harfe dönüştüren yardımcı fonksiyon
const turkishToLower = (text) => {
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ş/g, 'ş')
    .replace(/Ğ/g, 'ğ')
    .replace(/Ü/g, 'ü')
    .replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase();
};

export function AppSidebar({ onSignOut, ...props }) {
  const { user, isSignedIn } = useUser();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  // Login durumuna göre data içindeki user nesnesini oluştur
  const data = {
    user: {
      name: isSignedIn ? user?.fullName || user?.username : "DevBros", 
      // email: isSignedIn ? user?.primaryEmailAddress?.emailAddress : "Giriş yapınız",
      avatar: isSignedIn ? user?.imageUrl : "/avatars/shadcn.jpg",
    },
    navMain: [
            {
        title: "Lisanslar",
        url: "#",
        items: [
          {
            title: "Lisans Ekle",
            url: "lisansekle",
          },
          {
            title: "Lisans Listesi",
            url: "lisanslistesi",
          },
        ],
      },
      {
        title: "Müşteriler",
        url: "#",
        items: [
          {
            title: "Müşteri Ekle",
            url: "musteriekle",
          },
          {
            title: "Müşteri Listesi",
            url: "musterilistesi",
          },
        ],
      },
      {
        title: "Bayiler",
        url: "#",
        items: [
          {
            title: "Bayi Ekle",
            url: "bayiekle",
          },
          {
            title: "Bayi Listesi",
            url: "bayilistesi",
          },
        ],
      },
      {
        title: "Paketler",
        url: "#",
        items: [
          {
            title: "Paket Ekle",
            url: "paketekle",
          },
          {
            title: "Paket Listesi",
            url: "paketlistesi",
          },
        ],
      },
      {
        title: "Modüller",
        url: "#",
        items: [
          {
            title: "Modül Ekle",
            url: "modulekle",
          },
          {
            title: "Modül Listesi",
            url: "modullistesi",
          },
        ],
      },
      {
        title: "Demolar",
        url: "#",
        items: [
          {
            title: "İstek Ekle",
            url: "demoekle",
          },
          {
            title: "İstek Listesi",
            url: "demolistesi",
          },
        ],
      },
 
      {
        title: "Ayarlar",
        url: "#",
        items: [
          {
            title: "Genel Ayarlar",
            url: "ayarlar",
          },
        ],
      },
    ],
  };

  const [activeItem, setActiveItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState({});

  // Başlangıçta hangi kategori açılacak (0: Müşteriler, 1: Bayiler, 2: Demo Talebi, 3: İletişim, 4: Haberler)
  const defaultOpenCategoryIndex = 1; // İletişim kategorisi için

  // Sayfa yüklendiğinde, verideki isActive özelliğine göre başlangıç aktif öğesini ayarla
  useEffect(() => {
    // Tüm menü öğelerini düzleştir ve isActive özelliğine sahip olanı bul
    const allItems = data.navMain.flatMap(group => group.items || []);
    const defaultActive = allItems.find(item => item.isActive);
    
    if (defaultActive) {
      setActiveItem(defaultActive.title);
    }

    // Başlangıçta belirlenen kategoriyi aç
    setOpenCategories({ [defaultOpenCategoryIndex]: true });
  }, []);

  // Arama yapıldığında ilgili kategorileri otomatik olarak aç
  useEffect(() => {
    if (searchQuery.trim()) {
      const newOpenState = {};
      
      data.navMain.forEach((category, index) => {
        // Kategori başlığı arama sorgusunu içeriyor mu?
        const categoryMatch = turkishToLower(category.title).includes(turkishToLower(searchQuery));
        
        // Alt öğeler arama sorgusunu içeriyor mu?
        const itemsMatch = category.items?.some(item => 
          turkishToLower(item.title).includes(turkishToLower(searchQuery))
        );
        
        // Kategori veya alt öğelerinden herhangi biri eşleşirse, bu kategoriyi aç
        if (categoryMatch || itemsMatch) {
          newOpenState[index] = true;
        }
      });
      
      setOpenCategories(newOpenState);
    } else {
      // Arama olmadığında belirlenen kategoriyi aç
      setOpenCategories({ [defaultOpenCategoryIndex]: true });
    }
  }, [searchQuery]);

  // Öğeye tıklandığında çalışacak işleyici
  const handleItemClick = (itemTitle) => {
    setActiveItem(itemTitle);
  };

  // Kategori açma/kapama işleyicisi
  const handleCategoryToggle = (index, isOpen) => {
    setOpenCategories(prev => ({
      ...prev,
      [index]: isOpen
    }));
  };

  // Arama sorgusuna göre filtrelenen menü öğeleri
  const filteredNavData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data.navMain;
    }

    const query = turkishToLower(searchQuery);
    
    return data.navMain
      .map(category => {
        // Her kategori için alt öğeleri filtrele
        const filteredItems = category.items?.filter(item => 
          turkishToLower(item.title).includes(query)
        ) || [];
        
        // Eğer kategori adı veya alt öğeler içinde arama var ise, bu kategoriyi dahil et
        if (turkishToLower(category.title).includes(query) || filteredItems.length > 0) {
          return {
            ...category,
            // Kategori başlığında eşleşme varsa, tüm öğeleri göster
            items: turkishToLower(category.title).includes(query) 
              ? category.items 
              : filteredItems
          };
        }
        return null;
      })
      .filter(Boolean); // null kategorileri kaldır
  }, [searchQuery]);

  // Arama işleyicisi
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Sidebar
     {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
         
            <SidebarMenuButton size="lg" asChild >
            
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg " >
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Dev Bros Bayi Paneli</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm onSearch={handleSearch} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredNavData.length > 0 ? (
              filteredNavData.map((item, index) => {
                // Gerçek veri içindeki index'i bul
                const realIndex = data.navMain.findIndex(cat => cat.title === item.title);
                const isOpen = openCategories[realIndex] || false;
                
                return (
                  <Collapsible
                    key={item.title}
                    open={isOpen}
                    onOpenChange={(open) => handleCategoryToggle(realIndex, open)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton >
                          {item.title}{" "}
                          <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                          <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {item.items?.length ? (
                        <CollapsibleContent>
                          <SidebarMenuSub >
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title} >
                                <SidebarMenuSubButton  asChild>
                                  <NavLink
                                    to={subItem.url}
                                    className={
                                      activeItem === subItem.title
                                        ? "bg-indigo-100  font-medium rounded-md px-3 py-2 flex items-center border-l-4 border-indigo-500" // 
                                        : " text-sidebar-foreground px-3 py-2 rounded-md transition-colors duration-75"
                                    }
                                    onClick={() => handleItemClick(subItem.title)}
                                  >
                                    {subItem.title}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Sonuç bulunamadı
              </div>
            )}
      
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SignedIn>
          <div className="w-full relative" onClick={() => {
            // UserButton'ın içindeki gizli düğmeyi programatik olarak tıklamak için
            const userButtonEl = document.querySelector('.cl-userButtonTrigger');
            if (userButtonEl) {
              userButtonEl.click();
            }
          }}>
            <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors w-full cursor-pointer">
              <div className="shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || user?.username} />
                  <AvatarFallback>{(user?.fullName?.[0] || user?.username?.[0] || "U").toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 text-left truncate">
                <span className="text-base font-medium">{user?.fullName || user?.username || "Kullanıcı"}</span>
              </div>
            </div>
            <div className="absolute right-3 top-3 opacity-0">
              <UserButton 
                afterSignOutUrl="/" 
                onSignOutComplete={onSignOut}
              />
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 w-full">
                Giriş Yap
              </button>
            </DialogTrigger>
            <DialogContent className="p-0 border-none max-w-fit w-auto overflow-hidden bg-transparent shadow-none">
              <SignIn appearance={{
                baseTheme: neobrutalism,
                elements: {
                  rootBox: {
                    width: "auto",
                    maxWidth: "100%"
                  }
                }
              }}/>
            </DialogContent>
          </Dialog>
        </SignedOut>
      </SidebarFooter>
      
    </Sidebar>
    
  );
  
}
