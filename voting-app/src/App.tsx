import { Route, Routes } from "react-router";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/home/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
