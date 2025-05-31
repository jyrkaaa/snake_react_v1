import {GameStateProvider} from "@/game/state/GameStateProvider";
import Game from "@/game/state/Game";
import Header from "@/components/Header";
import React from "react";

export default function HomePage() {
  return (
      <GameStateProvider>
          <Header />
            <Game />
      </GameStateProvider>
  )
}
