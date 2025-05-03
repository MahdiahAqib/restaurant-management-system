import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Add this import
import Cookies from 'js-cookie';
import GuestMenuPage from '../../components/GuestMenuPage';
import UserMenuPage from '../../components//UserMenuPage';
import UserLayout from '../../components/UserLayout';

const MenuPageWrapper = () => {
    const router = useRouter(); // Initialize the router
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for forceGuest parameter first
        if (router.query.forceGuest) {
            setIsLoggedIn(false);
            setIsLoading(false);
            return;
        }

        // Normal auth check
        const userCookie = Cookies.get('user');
        setIsLoggedIn(!!userCookie);
        
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('/api/menu');
                const data = await response.json();
                setMenuItems(data);
                const uniqueCategories = [...new Set(data.map(item => item.category))];
                setCategories(uniqueCategories);
                if (uniqueCategories.length > 0) {
                    setActiveCategory(uniqueCategories[0]);
                }
            } catch (error) {
                console.error('Failed to load menu', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenuItems();
    }, [router.query]); // Add router.query as dependency

    if (isLoading) {
        return <div className="loading">Loading menu...</div>;
    }

    if (!isLoggedIn) {
        return (
            <GuestMenuPage 
                menuItems={menuItems}
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />
        );
    }

    return (
        <UserLayout>
            <UserMenuPage 
                menuItems={menuItems}
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />
        </UserLayout>
    );
};

export default MenuPageWrapper;