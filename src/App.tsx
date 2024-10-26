import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HeroList from "./components/HeroList/HeroList";
import HeroDetails from "./components/HeroDetails/HeroDetails";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroList />} />
        <Route path="/hero/:heroId" element={<HeroDetails />} />
      </Routes>
    </Router>
  );
};

export default App;