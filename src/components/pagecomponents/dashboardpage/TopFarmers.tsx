/* eslint-disable @next/next/no-img-element */
import React from "react";

const topFarmers = [
  { name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  {
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Robert Johnson",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Emily Davis",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "Michael Brown",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Sarah Wilson",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    name: "David Taylor",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    name: "Laura Harris",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    name: "James Anderson",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    name: "Megan Moore",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
  },
];

export default function TopFarmers() {
  return (
    <div className="py-2 lg:py-4 bg-white shadow rounded-xl">
      <div className="font-medium px-2 lg:px-4 space-y-2 mb-2">
        <h1 className="font-medium">शीर्ष 10 योगदानकर्ता किसानहरू</h1>
        <h3 className="text-sm font-medium text-gray-600">नाम</h3>
      </div>
      <hr />
      <ul className="divide-y divide-gray-200">
        {topFarmers.map((farmer, index) => (
          <li key={index} className="flex items-center py-2 px-4 space-x-4">
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="w-12 h-12 rounded-full border border-gray-300"
            />
            <div className="text-sm font-medium text-gray-900">
              {farmer.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
