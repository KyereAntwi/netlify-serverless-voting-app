import { Route, Routes } from "react-router";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/home/Workspaces";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "./pages/workspace-details/Layout";
import Dashboard from "./pages/workspace-details/Dashboard";

function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token: any) => {
        localStorage.setItem("token", JSON.stringify(token));
      });
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Home />} />
        <Route path="workspaces" element={<Home />} />
        <Route path="workspaces/:workspaceId" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
