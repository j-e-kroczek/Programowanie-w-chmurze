'use client'

import Board from "./components/board";
import { TicTacToeBoard } from "@/app/types/game";
import { Game } from "@/app/types/game";
import { useState } from "react";
import { useCookies } from "react-cookie"
import { navigate } from "../actions";



export default function Page({ params }: { params: { slug: string } }) {
    const [cookies, setCookie, removeCookie] = useCookies(['game', 'user']);

    const [gameData, setGameData] = useState<Game | null>(null);
    
    const getGameData = async () => {
        try {
        const response = await fetch(`http://localhost:3000/api/game/${params.slug}`);
        const data = await response.json();
        setGameData(data);
        }
        catch (error) {
            console.error(error);
            navigate("/");
        }
        
    }

    const makeMove = async (row: number, column: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/game/${params.slug}/move`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ row, column, playerId: cookies.user })
            });
            const data = await response.json();
            setGameData(data);
        } catch (error) {
            console.error(error);
        }
    }

    useState(() => {
        getGameData();
    });

    console.log(gameData);

    return (
        <div>
            <h1>{params.slug}</h1>
            {gameData?.board !== undefined && <Board board={gameData?.board} makeMove={makeMove} />}
        </div>
    );
}