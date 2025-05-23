import { NavLink } from 'react-router';
export default function MainNavigation() {
    return (
            <header>
                <nav>
                    <ul>
                        <li>
                            <NavLink className="text-5xl" to="/">Ana Sayfa</NavLink>
                        </li>
                        <li>
                            <NavLink className="text-5xl" to="/bayiekle">Bayi Ekle</NavLink>
                        </li>
                        <li>
                            <NavLink className="text-5xl" to="/bayilistesi">Bayi Listesi</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
    )
};