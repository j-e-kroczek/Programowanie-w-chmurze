'use client'

import Board from "./components/board";
import { TicTacToeBoard } from "@/app/types/game";
import { Game } from "@/app/types/game";
import { SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie"
import { navigate } from "../actions";
import { io } from "socket.io-client";
import toast from 'react-hot-toast';
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"

export default function Page({ params }: { params: { slug: string } }) {
    const socket = io("http://localhost:3000");
    const [cookies, setCookie, removeCookie] = useCookies(['game', 'playerPrivateKey', "playerPublicKey"]);
    const [gameData, setGameData] = useState<Game | null>(null);
    const [board, setBoard] = useState<TicTacToeBoard | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function connectToGame() {
        console.log("Connecting to game");
        socket.emit('joinGame', params.slug);
    }

    function onGameUpdate(value: SetStateAction<TicTacToeBoard | null>) {
        console.log("Game updated");
        console.log(value);
        if (value !== null) {
            getGameData();
            setBoard(value);
        }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('gameUpdated', onGameUpdate);
    connectToGame();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('updateGame', onGameUpdate);
    };
  }, [params.slug, socket]);

    
    
    const getGameData = async () => {
        try {
        const response = await fetch(`http://localhost:3000/api/game/${params.slug}`);
        const data = await response.json();
        setGameData(data);
        setBoard(data.board);
        setIsLoaded(true);
        }
        catch (error) {
            console.error(error);
            toast.error("Game not found");
            navigate("/");
        }
        
    }

    const makeMove = async (row: number, column: number) => {
        const response = await axios.post(`http://localhost:3000/api/game/${params.slug}/move`, {
            playerPrivateKey: cookies.playerPrivateKey,
            playerPublicKey: cookies.playerPublicKey,
            row: row,
            column: column
        }).catch((error) => {
            toast.error(error.response.data.message);
        }
        );
        if(response){
            const data = await response.data;
            console.log(data);
            setGameData(data);
            socket.emit('updateGame', params.slug);
        }
    }

    useState(() => {
        getGameData();
    });

    return (
        <div className="h-screen flex items-center justify-center">
            {isLoaded ?
            <Card className="w-[700px]">
                <CardHeader>
                    <CardTitle>
                        <div className="flex justify-between">
                            {gameData !== null && gameData.name}
                            <div>
                                <Badge variant="default">
                                    {gameData?.status === "winner" ? "Winner" : gameData?.status === "draw" ? "Draw" : "In progress"}
                                </Badge>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardDescription className="ms-3">
                    
                </CardDescription>
                <CardContent>
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">{gameData?.player1Name != null? gameData.player1Name:"N/A"}</h3>
                            <p className="text-muted-foreground">Player 1</p>
                        </div>
                        {gameData?.currentPlayer === cookies.playerPublicKey && "Your turn"}
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">{gameData?.player2Name != null? gameData.player2Name:"N/A"}</h3>
                            <p className="text-muted-foreground">Player 2</p>
                        </div>  
                    </div>
                    {board !== null && <Board board={board} makeMove={makeMove} />}
                </CardContent>
                <CardFooter>
                    {isConnected ? <Badge variant="default">Connected</Badge> : <Badge variant="destructive">Disconnected, try to refresh</Badge>}
                </CardFooter>
            </Card>
        : <p>Loading...</p>}
        </div>
    );
}