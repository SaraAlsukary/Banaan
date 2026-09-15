// app/page.tsx
import HomePageUI from "@/components/HomePageUI";
import { currentUser } from "@clerk/nextjs/server";
import { getProducts } from "../actions/products";
import { getSubcategories } from "../actions/subcategories";

export default async function HomePage() {
    // 1. Fetch user data from Clerk
    const user = await currentUser();
    const isLoggedIn = !!user;
    const firstName = user?.firstName || "";
    
    // 2. Fetch data from your database
    // (Assuming you map your DB results to match the interfaces in HomePageUI)
    const dbProducts = await getProducts(); 
    const dbCategories = await getSubcategories();

    // 3. Render the Client UI with the Server Data
    return (
        <HomePageUI 
            isLoggedIn={isLoggedIn}
            firstName={firstName}
            hasDbUser={true} // Add your logic to check if they exist in Neon DB
            categoriesList={dbCategories}
            bestsellersList={dbProducts}
        />
    );
}