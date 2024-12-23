import './App.css';
import { Stage, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import '@pixi/events';

import { Event, useSocketEvents } from './hooks/useSocketEvents';
import {Grid} from "./models/grid.ts";
import {useCallback, useState} from "react";
import {Button} from "./atoms/Button.tsx";
import {socket} from "./main.tsx";

const cellWidth = 50; // Width of each cell
const cellHeight = 50; // Height of each cell

const App = () => {
    const [grid, setGrid] = useState<Grid>();
    const events: Event[] = [
        {
            name: 'serverReady_loadGrid',
            handler(message: any) {
                console.log("message", message);
                setGrid(message);
            },
        },
    ];
    const drawGrid = useCallback(
        (g: PIXI.Graphics) => {
            if(!grid) {
                return;
            }
            g.clear();
            g.lineStyle(1, 0xffffff, 1); // Line thickness, color, and alpha

            // Draw vertical lines
            for (let i = 0; i <= grid.numberOfColumns; i++) {
                const x = i * cellWidth;
                g.moveTo(x, 0);
                g.lineTo(x, grid.numberOfRows * cellHeight);
            }

            // Draw horizontal lines
            for (let j = 0; j <= grid.numberOfRows; j++) {
                const y = j * cellHeight;
                g.moveTo(0, y);
                g.lineTo(grid.numberOfColumns * cellWidth, y);
            }
        },
        [grid, cellWidth, cellHeight]
    );

    useSocketEvents(events);

    const handleLoadGridButton = () => {
        socket.emit('clientReady_loadGrid');
    };

    return (
        <Stage width={800} height={600} options={{ background: 0x1099bb }}>
            {
                grid ? (<>
                        <Graphics draw={drawGrid} />
                    </>
                ) : (
                    <>
                        <Button x={300} y={250} width={200} height={50} text="Load grid" onClick={handleLoadGridButton} />
                    </>
                )
            }
        </Stage>
    );
};

export default App;
