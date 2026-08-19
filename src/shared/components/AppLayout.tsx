import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Header />

        <main
          style={{
            padding: "30px",
            background: "#f1f5f9",
            minHeight: "calc(100vh - 70px)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}