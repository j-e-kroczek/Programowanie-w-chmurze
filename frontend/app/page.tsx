'use client'

import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { ModeToggle } from "@/components/ui/theme-toggle"
import { GameTable } from "./game-table"
import axios from "axios"
import { Game } from "./types/game"
import { socket } from "./service/socket"
import { use, useEffect, useState } from "react"

export default function GameListPage() {

  const [games, setGames] = useState<Game[]>([])
  const [connected, setConnected] = useState(false);

  useEffect(() => {
      socket.emit('HELLO_THERE');
      const eventHandler = () => setConnected(true);
      socket.on('WELCOME_FROM_SERVER', eventHandler);
      return () => {
         socket.off('WELCOME_FROM_SERVER', eventHandler);
      };
   }, []);

  const getGamesData = async () => {
    const response = await axios.get("http://localhost:3000/api/game")
    return response.data
  }
  
  useEffect(() => {
    getGamesData().then((data) => {
      setGames(data)
    })
  }
  , [])

   useEffect(() => {
    socket.on("game-created", (data) => {
      getGamesData().then((data) => {
        setGames(data)
      }
      )
    });
  }, []);
  
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
        <GameTable games={games}></GameTable>
      </div>
    </> 
  )
}