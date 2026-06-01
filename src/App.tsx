import ErrorPage from "./components/error/errorPage";
import Layout from "./components/layout/Layout";
import RASLayout from "./components/ras/RASLayout";
import Root from "./pages/Home";
import { Routes, Route, HashRouter } from "react-router-dom";
import PcbWidthCalculator from "./pages/pcbWidthCalculator/PcbWidthCalculator";
import LipoEstimator from "./pages/batteryEstimator/BatteryEstimator";
import MembersPage from "./pages/members/members";
import ToolsHub from "./pages/tools/ToolsHub";
import { ToastContainer } from "react-toastify";
import EventsPage from "./pages/events/events";
import ControllerView from "./pages/controller/Controller";
import LidarView from "./pages/lidarView/LidarView";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Home — standalone editorial page, no layout wrapper */}
        <Route path="/" element={<Root />} />

        {/* Redesigned pages — new editorial nav + footer */}
        <Route element={<RASLayout />}>
          <Route path="/members" element={<MembersPage />} />
          <Route path="/tools" element={<ToolsHub />} />
          <Route path="/tools/pcb-calculator" element={<PcbWidthCalculator />} />
          <Route path="/tools/lipo-estimator" element={<LipoEstimator />} />
        </Route>

        {/* Legacy pages — old dark-theme Layout, unchanged */}
        <Route element={<Layout />}>
          <Route path="/events" element={<EventsPage />} />
          <Route path="/controller" element={<ControllerView />} />
          <Route path="/lidar-view" element={<LidarView />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </HashRouter>
  );
}
