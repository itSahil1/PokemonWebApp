import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { PokemonProvider } from "./contexts/PokemonContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparePage from "./pages/ComparePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/pokemon/:id" component={PokemonDetailPage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/compare" component={ComparePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <PokemonProvider>
      <FavoritesProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </FavoritesProvider>
    </PokemonProvider>
  );
}

export default App;
