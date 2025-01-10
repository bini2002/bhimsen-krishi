// src/pages/index.tsx
import PageLayout from "@/components/globalcomponents/PageLayout";
import withAuth from "@/components/globalcomponents/withAuth";
import AdminProfile from "@/components/pagecomponents/dashboardpage/AdminProfile";
import DashboardStats from "@/components/pagecomponents/dashboardpage/DashboardStats";
import { MapComponent } from "@/components/pagecomponents/dashboardpage/farmers-map";
import MajorCropsProductionChart from "@/components/pagecomponents/dashboardpage/MajorCropsProductionChart";
import RecentlyJoined from "@/components/pagecomponents/dashboardpage/RecentlyJoined";
import TopFarmers from "@/components/pagecomponents/dashboardpage/TopFarmers";
import TopNotice from "@/components/pagecomponents/dashboardpage/TopNotice";
import Weather from "@/components/pagecomponents/dashboardpage/Weather";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();

  // Check if the user has completed their profile/KYC
  const isProfileCompleted = session?.user?.image; // Adjust this based on your actual user object structure

  if (!isProfileCompleted) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold">तपाईको प्रोफाइल पूरा गर्नुहोस्</h2>
          <p className="mt-4 text-lg">कृपया KYC प्रक्रिया पूरा गर्नुहोस्।</p>
          <button className="mt-6 bg-blue-500 text-white p-2 rounded">
            KYC पूरा गर्न यहाँ क्लिक गर्नुहोस्
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="grid lg:grid-cols-4 gap-4 lg:gap-8">
        <div className="lg:col-span-3 overflow-hidden">
          <div className="mb-4">
            <TopNotice />
          </div>
          <DashboardStats />
          <div className="mt-6 space-y-6">
            <MajorCropsProductionChart />
            <MapComponent />
            <RecentlyJoined />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <AdminProfile />
          <Weather />
          <TopFarmers />
        </div>
      </section>
    </PageLayout>
  );
};

export default withAuth(Home);
