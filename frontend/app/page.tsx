import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { ModeToggle } from "@/components/ui/theme-toggle"
import { GameTable } from "./game-table"

export const metadata: Metadata = {
  title: "Game list",
  description: "A list of available games to play",
}


export default async function GameListPage() {

  return (
    <>
      <div className="flex flex-row mt-3 ml-3">
        <div className="basis-3/4">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here are list of available games
            </p></div>
        <div className="basis-1/4 flex justify-end me-3"><ModeToggle></ModeToggle></div>
      </div>
      <div className="flex flex-row m-3">
        <GameTable></GameTable>
      </div>
    </>
  )
}