import { HeroFavorites } from "@/features/HeroFavorites";
import { MustSee } from "@/features/MustSee";

export function Favorites() {
  return (
    <div class="page">
      <HeroFavorites />
      <MustSee />
    </div>
  );
}
