import ErrorPage from "./components/error/errorPage";
import Layout from "./components/layout/Layout";
import RASLayout from "./components/ras/RASLayout";
import Root from "./pages/Home";
import { Routes, Route, HashRouter } from "react-router-dom";
import PcbWidthCalculator from "./pages/pcbWidthCalculator/PcbWidthCalculator";
import LipoEstimator from "./pages/batteryEstimator/BatteryEstimator";
import MembersPage from "./pages/members/members";
import ToolsHub from "./pages/tools/ToolsHub";
import SwarmProject from "./pages/swarm/SwarmProject";
import RobotSpark from "./pages/robotSpark/RobotSpark";
import BertoCtf from "./pages/bertoCtf/BertoCtf";
import BertoSolutions from "./pages/bertoCtf/BertoSolutions";
import HistoricIndex from "./pages/historic/HistoricIndex";
import BitacoraTimeline from "./pages/historic/BitacoraTimeline";
import { ToastContainer } from "react-toastify";
import EventsPage from "./pages/events/events";
import ControllerView from "./pages/controller/Controller";
import LidarView from "./pages/lidarView/LidarView";
import ROS2Installer from "./pages/ros2Installer/ROS2Installer";
import './styles/ras-pages.css'
import './styles/ras-tokens.css'
export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Home — standalone editorial page, no layout wrapper */}

        {/* BERTO CTF — immersive standalone experience, its own dark theme */}
        <Route path="/robot-spark/berto" element={<BertoCtf />} />
        {/* Teacher-only solutions — obscure URL, intentionally unlinked */}
        <Route path="/robot-spark/berto/protocolo-7c3f9a2e" element={<BertoSolutions />} />

        {/* Redesigned pages — new editorial nav + footer */}
        <Route path= "/" element={<RASLayout />}>
          <Route index element={<Root />} />
          <Route path="/equipo" element={<MembersPage />} />
          <Route path="/tools" element={<ToolsHub />} />
          <Route path="/tools/pcb-calculator" element={<PcbWidthCalculator />} />
          <Route path="/tools/lipo-estimator" element={<LipoEstimator />} />
          <Route path="/tools/ros2-installer" element={<ROS2Installer />} />
          <Route path="/swarm-project" element={<SwarmProject />} />
          <Route path="/robot-spark" element={<RobotSpark />} />
          <Route path="/bitacora" element={<HistoricIndex />} />
          <Route path="/bitacora/:slug" element={<BitacoraTimeline />} />
        </Route>

        {/* Standalone — no Layout navbar/sidebar, just its own back button */}
        <Route path="/events" element={<EventsPage />} />

        {/* Legacy pages — old dark-theme Layout, unchanged */}
        <Route element={<Layout />}>
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
