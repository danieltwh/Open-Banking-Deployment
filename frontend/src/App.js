import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { styled } from "@mui/material";
import AppAppBar from "./components/appBar";
import MainPage from "./pages/main";
import AboutUs from "./pages/about";

const AppBarHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
  marginBottom: 20,
}));

function App() {
  return (
    <BrowserRouter>
      <AppAppBar />
      <AppBarHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
