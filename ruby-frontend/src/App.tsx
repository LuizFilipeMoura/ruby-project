import './App.css';
import {Stage, Graphics, Container, Text} from '@pixi/react';
import * as PIXI from 'pixi.js';
import '@pixi/events';

import { Event, useSocketEvents } from './hooks/useSocketEvents';
import {Grid} from "./models/grid.ts";
import {useState} from "react";
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
    const [hoveredCells, setHoveredCells] = useState<{ [key: string]: boolean }>({});

    // const drawGrid = useCallback(
    //     (g: PIXI.Graphics) => {
    //         if(!grid) {
    //             return;
    //         }
    //         g.clear();
    //         g.lineStyle(1, 0xffffff, 1); // Line thickness, color, and alpha
    //
    //         // Draw vertical lines
    //         for (let i = 0; i <= grid.numberOfColumns; i++) {
    //             const x = i * cellWidth;
    //             g.moveTo(x, 0);
    //             g.lineTo(x, grid.numberOfRows * cellHeight);
    //         }
    //
    //         // Draw horizontal lines
    //         for (let j = 0; j <= grid.numberOfRows; j++) {
    //             const y = j * cellHeight;
    //             g.moveTo(0, y);
    //             g.lineTo(grid.numberOfColumns * cellWidth, y);
    //         }
    //     },
    //     [grid, cellWidth, cellHeight]
    // );
    const drawCell = (g: PIXI.Graphics, isHovered: boolean) => {
        g.clear();
        g.beginFill(isHovered ? 0xffcc00 : 0x0099ff); // Highlighted or default color
        g.drawRect(0, 0, cellWidth, cellHeight);
        g.endFill();
        g.lineStyle(1, 0xffffff, 1);
        g.drawRect(0, 0, cellWidth, cellHeight);
    };
    const getCellKey = (row: number, col: number) => `${row}-${col}`;

    useSocketEvents(events);

    const handleLoadGridButton = () => {
        socket.emit('clientReady_loadGrid');
    };

    return (
        <Stage width={800} height={600} options={{ background: 0x1099bb }}>
            {
                grid ? (<>
                        <Container>
                            {Array.from({ length: grid.numberOfRows }, (_, row) =>
                                Array.from({ length: grid.numberOfColumns }, (_, col) => {
                                    const cellKey = getCellKey(row, col);
                                    const isHovered = hoveredCells[cellKey] || false;

                                    return (
                                        <Container
                                            key={cellKey}
                                            x={col * cellWidth}
                                            y={row * cellHeight}
                                            interactive={true}
                                            pointerover={() =>
                                                setHoveredCells((prev) => ({ ...prev, [cellKey]: true }))
                                            }
                                            pointerout={() =>
                                                setHoveredCells((prev) => ({ ...prev, [cellKey]: false }))
                                            }
                                            pointerdown={() =>
                                                alert(`You clicked cell at column ${col + 1}, row ${row + 1}`)
                                            }
                                        >
                                            <Graphics draw={(g) => drawCell(g, isHovered)} />
                                            <Text
                                                text={`${col + 1},${row + 1}`}
                                                x={cellWidth / 2}
                                                y={cellHeight / 2}
                                                anchor={0.5}
                                                style={{
                                                    fontSize: 12,
                                                    fill: '#ffffff',
                                                }}
                                            />
                                        </Container>
                                    );
                                })
                            )}
                        </Container>
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
