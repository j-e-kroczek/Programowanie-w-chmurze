'use client'

import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { ModeToggle } from "@/components/ui/theme-toggle"
import { GameTable } from "./game-table"
import axios from "axios"
import { Game } from "./types/game"
import toast from "react-hot-toast"
import { use, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { navigate } from "./actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function GameListPage() {

  const [games, setGames] = useState<Game[]>([])
  const [cookies, setCookie, removeCookie] = useCookies(['game', 'playerPrivateKey', "playerPublicKey"]);
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const getGamesData = async () => {
    const response = await axios.get("http://localhost:3000/api/game")
    toast.success("Games loaded")
    setGames(response.data)
    setIsLoaded(true)
  }
  
  useEffect(() => {
    if (cookies.playerPrivateKey !== undefined) {
      const response = axios.get(`http://localhost:3000/api/game/${cookies.game}`)
      .then(response => {
        if (response.data.player1pub === cookies.playerPublicKey || response.data.player2pub === cookies.playerPublicKey) {
          setIsOpen(true)
        }
      }).catch(error => {
        axios.post(`http://localhost:3000/api/game/quit-any`, {
          playerPrivateKey: cookies.playerPrivateKey,
        })
        removeCookie("game")
        removeCookie("playerPrivateKey")
        removeCookie("playerPublicKey")
      } 
      )
    }
    getGamesData()
  }
  , [cookies.game, cookies.playerPrivateKey, cookies.playerPublicKey, removeCookie])

  const reconnect = () => {
    navigate("/"+cookies.game)
  }

  const quitGame = async () => {
    axios.post(`http://localhost:3000/api/game/quit-any`, {
      playerPrivateKey: cookies.playerPrivateKey,
    })
    removeCookie("game")
    removeCookie("playerPrivateKey")
    removeCookie("playerPublicKey")
    setIsOpen(false)
  }
  
  return (
    <>
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reconnect to game</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          You are still connected to a game. Do you want to reconnect?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <Button onClick={reconnect}>Reconnect</Button>
          <Button variant={"secondary"} onClick={quitGame}>Cancel</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

      {isLoaded ?      
      <><div className="flex flex-row mt-3 ml-3">
          <div className="basis-3/4">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here are list of available games
            </p></div>
          <div className="basis-1/4 flex justify-end me-3"><ModeToggle></ModeToggle></div>
        </div><div className="flex flex-row m-3">
            <GameTable games={games} refresh={getGamesData}></GameTable>
          </div></>
      : <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>}
    </> 
  )
}