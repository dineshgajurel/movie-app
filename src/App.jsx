import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import MovieDetails from "./components/MovieDetails";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/movie/:id" element={<MovieDetails />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
