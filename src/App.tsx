import { Route, Routes } from "react-router";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/home/Workspaces";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "./pages/workspace-details/Layout";
import Dashboard from "./pages/workspace-details/Dashboard";
import AllECS from "./pages/ecs/AllECS";
import LoadingPage from "./components/LoadingPage";
import Candidates from "./pages/candidates/Candidates";
import Polls from "./pages/polls/Polls";
import PollLayout from "./pages/poll-details/Layout";
import PollDetailsWelcome from "./pages/poll-details/PollDetailsWelcome";

function App() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const setToken = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        localStorage.setItem("token", JSON.stringify(token));
      }
      setTokenReady(true);
    };
    setToken();
  }, [isAuthenticated, getAccessTokenSilently, localStorage]);

  if (isLoading || !tokenReady) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Home />} />
        <Route path="workspaces" element={<Home />} />
        <Route path="workspaces/:workspaceId" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ecs" element={<AllECS />} />
          <Route path="nominees" element={<Candidates />} />
          <Route path="polls" element={<Polls />} />
        </Route>
        <Route
          path="workspaces/:workspaceId/polls/:pollId"
          element={<PollLayout />}
        >
          <Route index element={<PollDetailsWelcome />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
