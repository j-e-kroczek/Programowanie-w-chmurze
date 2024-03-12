'use client'

import Board from "./components/board";
import { TicTacToeBoard } from "@/app/types/game";
import { Game } from "@/app/types/game";
import { SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie"
import { navigate } from "../actions";
import { socket } from "../service/socket";
import toast from 'react-hot-toast';
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function Page({ params }: { params: { slug: string } }) {
    const [cookies, setCookie, removeCookie] = useCookies(['game', 'playerPrivateKey', "playerPublicKey"]);
    const [gameData, setGameData] = useState<Game | null>(null);
    const [board, setBoard] = useState<TicTacToeBoard | null>(null);
    const [isConnected, setIsConnected] = useState(socket.connected);
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
        socket.connect();
        socket.emit('joinGame', params.slug);
    }

    async function onGameUpdate() {
        try {
            const response = await axios.get(`http://localhost:3000/api/game/${params.slug}`);
            const data = await response.data;
            setGameData(data);
            setBoard(data.board);
        }
        catch (error) {
            console.error(error);
            toast.error("Game not found");
            navigate("/");
        }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('gameUpdated', onGameUpdate);
    socket.on('playerJoined', onGameUpdate);
    connectToGame();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('updateGame', onGameUpdate);
    };
  }, [params.slug]);

    
    
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
            setGameData(data);
            setBoard(data.board);
            socket.emit('updateGame', params.slug);
        }
    }

    const restartGame = async () => {
        const response = await axios.post(`http://localhost:3000/api/game/${params.slug}/restart`, {
            playerPrivateKey: cookies.playerPrivateKey,
            playerPublicKey: cookies.playerPublicKey
        }).catch((error) => {
            toast.error(error.response.data.message);
        }
        );
        if(response){
            const data = await response.data;
            setGameData(data);
            setBoard(data.board);
            socket.emit('updateGame', params.slug);
        }
    }

    const quitGame = async () => {
        const response = await axios.post(`http://localhost:3000/api/game/${params.slug}/quit`, {
            playerPrivateKey: cookies.playerPrivateKey,
            playerPublicKey: cookies.playerPublicKey
        }).catch((error) => {
            toast.error(error.response.data.message);
        }
        );
        if(response){
            const data = await response.data;
            console.log(data);
            navigate("/");
        }
    }

    useState(() => {
        getGameData();
    });

    return (
        <div className="h-screen flex items-center justify-center">
            {isLoaded ?

            <>
            {gameData?.status === "winner" &&
            <AlertDialog defaultOpen={true}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{gameData.currentPlayer === gameData.player1pub ? "Player 1 has won!" : "Player 2 has won!"}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button variant={"secondary"} onClick={quitGame}>Back to home</Button>
                            {gameData.currentPlayer === cookies.playerPublicKey && <Button onClick={restartGame}>Play again</Button>}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            }
            {gameData?.status === "draw" &&
            <AlertDialog defaultOpen={true}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>It&apos;s a draw!</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button variant={"secondary"} onClick={quitGame}>Back to home</Button>
                            {gameData.currentPlayer === cookies.playerPublicKey && <Button onClick={restartGame}>Play again</Button>}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            }
                
                <Card className="w-[700px]">
                        <CardHeader>
                            <CardTitle>
                                <div className="flex justify-between">
                                    {gameData !== null && gameData.name}
                                    <div>
                                        <Badge variant="default">
                                            {gameData?.status === "winner" ? "Winner" : gameData?.status === "draw" ? "Draw" : gameData?.status === "in-progress" ? "In progress" : "Pending"}
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
                                    <h3 className="text-2xl font-bold tracking-tight">{gameData?.player1Name != null ? gameData.player1Name : "N/A"}</h3>
                                    <p className="text-muted-foreground">Player 1</p>
                                </div>
                                {gameData?.currentPlayer === cookies.playerPublicKey && "Your turn"}
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight">{gameData?.player2Name != null ? gameData.player2Name : "N/A"}</h3>
                                    <p className="text-muted-foreground">Player 2</p>
                                </div>
                            </div>
                            {board !== null && <Board board={board} makeMove={makeMove} />}
                        </CardContent>
                        <CardFooter>
                            <div className="w-full flex justify-between">
                                {isConnected ? <Badge variant="default">Connected</Badge> : <Badge variant="destructive">Disconnected, try to refresh</Badge>}
                                <Button variant="secondary" onClick={quitGame}>Quit game</Button>
                            </div>
                        </CardFooter>
                    </Card></>
        : <p>Loading...</p>}
        </div>
    );
}