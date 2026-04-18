import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import SearchBar from "@/components/SearchBar";
import FoodCategories from "@/components/FoodCategories";
import NewFeatures from "@/components/NewFeatures";
import TopRestaurantChains from "@/components/TopRestaurantChains";
import RestaurantList from "@/components/RestaurantList";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <Header />
      <PromoBanner />
      <SearchBar />
      <FoodCategories />
      <NewFeatures />
      <TopRestaurantChains />
      <RestaurantList />
      <BottomNav />
    </main>
  );
}
