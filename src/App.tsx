import { Route, Routes } from "react-router";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/home/Workspaces";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

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
      </Route>
    </Routes>
  );
}

export default App;
