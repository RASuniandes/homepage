import ErrorPage from "./components/error/errorPage";
import Layout from "./components/layout/Layout";
import Root from "./pages/Home";
import { Routes, Route, HashRouter } from "react-router-dom";
import PcbWidthCalculator from "./pages/pcbWidthCalculator/PcbWidthCalculator";
import LipoEstimator from "./pages/batteryEstimator/BatteryEstimator";
import MembersPage from "./pages/members/members";
import { ToastContainer } from "react-toastify";
export default function App() {

  return (
    <HashRouter>
      <Routes>
      <Route
        path="/"
        element={<Layout />}
      >
        <Route path="" element={<Root />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="tools/lipo-estimator" element={<LipoEstimator />} />
        <Route path="tools/pcb-calculator" element={<PcbWidthCalculator />} />
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
};

