import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { formatDate, useAuth } from "../utils/Provider";
import { AuthGuard } from "../utils/AuthGuard";
import { DateTime } from "../components/Timer/DateTime";
import { Outlet } from "react-router-dom";

function Dashboard() {
  const auth = useAuth();

  return (
    <AuthGuard>
      <div className="hero flex h-screen">
        <Sidebar />

        <div className="flex flex-col flex-1">
          <Navbar />
          <div className="flex-1 overflow-y-auto w-full bg-white p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default Dashboard;
