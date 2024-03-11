import Board from "./components/board";
import { TicTacToeBoard } from "@/app/types/game";



export default function Page({ params }: { params: { slug: string } }) {
        const board: TicTacToeBoard = [
            {
                "row": [
                    {
                        "value": "P2"
                    },
                    {
                        "value": null
                    },
                    {
                        "value": null
                    }
                ]
            },
            {
                "row": [
                    {
                        "value": null
                    },
                    {
                        "value": null
                    },
                    {
                        "value": null
                    }
                ]
            },
            {
                "row": [
                    {
                        "value": null
                    },
                    {
                        "value": "P1"
                    },
                    {
                        "value": null
                    }
                ]
            }
        ]
    return (
        <div>
            <h1>{params.slug}</h1>
            <Board board={board} />
        </div>
    );
}