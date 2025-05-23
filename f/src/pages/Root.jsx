import Ana from "../components/Ana"
import { SignIn } from '@clerk/clerk-react'
import { neobrutalism } from '@clerk/themes'
import { useState, useEffect } from "react"
import { useUser, useAuth, useClerk } from "@clerk/clerk-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function Root() {
    const { isSignedIn, isLoaded, user } = useUser();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [lastSignedInUser, setLastSignedInUser] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { signOut } = useClerk();

    // Sayfa yüklendiğinde ve kullanıcı oturum açmamışsa login dialogu aç
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            setIsLoginOpen(true);
        } else if (isSignedIn) {
            setIsLoginOpen(false);
        }
    }, [isLoaded, isSignedIn]);
    
    // Kullanıcı başarıyla giriş yaptığında çağrılacak fonksiyon
    const handleSignInComplete = async () => {
        try {
            // İşlem zaten devam ediyorsa çık
            if (isLoggingIn) return;
            setIsLoggingIn(true);
            
            // Kullanıcı adını belirle - mevcut kullanıcı verisinden al
            const username = 
                user?.username || 
                user?.firstName?.toLowerCase() || 
                user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
                'default';
            
            console.log('Oturum açan kullanıcı:', username);
            toast.loading(`${username} için veritabanı bağlantısı kuruluyor...`);
            
            // Backend'e kullanıcı adını gönder, bu kullanıcı adına göre DB_NAME güncellenecek
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: username,
                    password: 'clerk-auth' // Sadece API uyumluluğu için
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Veritabanı bağlantısı sırasında hata oluştu');
            }
            
            console.log(`${username} kullanıcısı için veritabanı ayarlandı`);
            
            // Her durumda sayfayı tamamen yenile
            if (lastSignedInUser !== username) {
                console.log(`Kullanıcı değişti: ${lastSignedInUser || 'ilk giriş'} -> ${username}, sayfa yenileniyor...`);
                toast.success(`${username} kullanıcısına geçiş yapıldı, sayfa yenileniyor...`);
                
                // Oturum bilgilerini kaydet ve sayfayı yenile
                sessionStorage.setItem('currentUser', username);
                
                // Hard yenileme
                setTimeout(() => {
                    window.location.href = window.location.href.split('#')[0];
                }, 1000);
            } else {
                toast.success(`${username} kullanıcısı olarak giriş yapıldı`);
                setLastSignedInUser(username);
                setIsLoggingIn(false);
            }
        } catch (error) {
            console.error('Veritabanı bağlantısı kurulurken hata:', error);
            toast.error(`Bağlantı hatası: ${error.message}`);
            setIsLoggingIn(false);
        }
    };
    
    // Kullanıcı çıkış yaptığında backend'e bildirim gönder ve sayfayı yenile
    const handleSignOut = async () => {
        try {
            const username = 
                user?.username || 
                user?.firstName?.toLowerCase() || 
                user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
                'default';
                
            toast.loading(`${username} kullanıcısı çıkış yapıyor...`);
                
            // Önce backend'e logout bildirimi gönder
            const response = await fetch(`${API_URL}/api/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Çıkış yaparken hata:', errorData);
            }
            
            // Session bilgilerini temizle
            sessionStorage.removeItem('currentUser');
            
            // Sonra Clerk'ten çıkış yap
            await signOut();
            
            // Sayfayı tamamen yenile (hard refresh)
            toast.success('Başarıyla çıkış yapıldı, sayfa yenileniyor...');
            setTimeout(() => {
                window.location.href = window.location.href.split('#')[0]; 
            }, 1000);
        } catch (error) {
            console.error('Çıkış yapılırken hata oluştu:', error);
            toast.error(`Çıkış yapılırken hata: ${error.message}`);
            // Hata olsa da sayfayı yenile
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };
    
    // Kullanıcı giriş yaptığında veritabanı bağlantısını ayarla
    useEffect(() => {
        // Sayfa yüklendiğinde önceki oturum bilgisini kontrol et
        const previousUser = sessionStorage.getItem('currentUser');
        
        if (isSignedIn && user && !isLoggingIn) {
            const currentUsername = 
                user?.username || 
                user?.firstName?.toLowerCase() || 
                user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
                'default';
                
            // Kullanıcı değiştiyse veya oturum bilgisi yoksa işlemi başlat
            if (previousUser !== currentUsername) {
                handleSignInComplete();
            } else {
                setLastSignedInUser(currentUsername);
            }
        }
    }, [isSignedIn, user]);

    // Veritabanı bağlantı durumunu periyodik olarak kontrol et
    useEffect(() => {
        let intervalId;
        
        const checkDbConnection = async () => {
            if (!isSignedIn) return;
            
            try {
                const response = await fetch(`${API_URL}/api/db-status`);
                if (!response.ok) {
                    console.error('Veritabanı durum kontrolü başarısız');
                    return;
                }
                
                const data = await response.json();
                
                if (data.status !== 'connected') {
                    console.error('Veritabanı bağlantısı kopmuş!');
                    toast.error('Veritabanı bağlantısı koptu! Sayfayı yenileyin.');
                }
            } catch (error) {
                console.error('Veritabanı durum kontrolü hatası:', error);
            }
        };
        
        if (isSignedIn) {
            // İlk kontrol
            checkDbConnection();
            // 30 saniyede bir kontrol et
            intervalId = setInterval(checkDbConnection, 30000);
        }
        
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isSignedIn]);

    return(
        <>
            <Dialog open={isLoginOpen} onOpenChange={(open) => {
                // Dialog kapatma denemesinde, eğer kullanıcı giriş yapmamışsa kapatmaya izin verme
                if (!open && !isSignedIn) {
                    return;
                }
                setIsLoginOpen(open);
            }}>
                <DialogContent className="p-0 border-none max-w-fit w-auto overflow-hidden bg-transparent shadow-none">
                    <SignIn 
                        appearance={{
                            baseTheme: neobrutalism,
                            elements: {
                                rootBox: {
                                    width: "auto",
                                    maxWidth: "100%"
                                }
                            }
                        }}
                        redirectUrl="/"
                        afterSignInUrl="/"
                    />
                </DialogContent>
            </Dialog>
            
            {isSignedIn && <Ana onSignOut={handleSignOut} />}
        </>
    )
};