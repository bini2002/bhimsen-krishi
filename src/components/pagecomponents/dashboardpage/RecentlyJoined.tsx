import useFetchData from "@/hook/useFetchData";
import { nepaliNumbers } from "@/utils/translations";
import { useEffect, useState } from "react";

const RecentlyJoined = () => {
  const [data, setData] = useState([]);
  const { fetchedData } = useFetchData("/user");

  useEffect(() => {
    if (fetchedData) {
      const transformedData = fetchedData?.data?.result
        ?.slice(0, 9)
        .map((user: any) => ({
          id: user.id,
          name: user.email, // You might want to display the user's name instead of email
          date: new Date(user.createdAt).toLocaleDateString("ne-NP"), // Use Nepali locale
        }));
      setData(transformedData);
    }
  }, [fetchedData]);

  return (
    <section className="mt-4 lg:mt-8 px-4 sm:px-0">
      <div>
        <h2 className="lg:text-lg font-medium mb-4">
          हालसालै सामेल भएका प्रयोगकर्ता
        </h2>
        <div className="overflow-x-auto rounded-lg overflow-hidden">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left font-semibold hidden sm:table-cell">
                  किसान ID
                </th>
                <th className="py-2 px-4 text-left font-semibold">नाम</th>
                <th className="py-2 px-4 text-left font-semibold hidden sm:table-cell">
                  मिति
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((user: any, index: number) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-100 text-xs md:text-sm"
                >
                  <td className="py-2 px-4 hidden sm:table-cell">
                    {nepaliNumbers(index + 1)}
                  </td>
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4 hidden sm:table-cell">
                    {user.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RecentlyJoined;
