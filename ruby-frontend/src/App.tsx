import './App.css';
import {Container, Graphics, Sprite, Stage} from '@pixi/react';
import * as PIXI from 'pixi.js';
import '@pixi/events';
import {Event, playerEmit, useSocketEvents} from './hooks/useSocketEvents';
import {Grid} from "./models/grid.ts";
import { useState} from "react";
import {Button} from "./atoms/Button.tsx";
import {GameState} from "./models/gameState.ts";
import {UnitAnimatedSprite} from "./components/UnitAnimatedSprite.tsx";
import {Unit} from "./models/unit.ts";




const cellWidth = 50; // Width of each cell
const cellHeight = 50; // Height of each cell

const App = () => {

    const [grid, setGrid] = useState<Grid>();
    const [units, setUnits] = useState<Unit[]>();

    const events: Event[] = [
        {
            name: 'completeGameStateTick',
            handler(message: GameState) {
                const {grid, units} = message;
                console.log("units", units);
                setGrid(grid);
                setUnits(units);

            },
        },
        {
            name: 'preGameStart:AssignPlayerId',
            handler(message: any) {
                // console.log("message", message);
                sessionStorage.setItem("playerId", message.playerId);
            },
        },
    ];
    const hasUnitOnCell = (x: number, y: number) => {
        return units?.some((unit) => unit?.positionCell?.x === x && unit?.positionCell?.y === y);
    }
    const [hoveredCells, setHoveredCells] = useState<{ [key: string]: boolean }>({});

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

    const handlePlayerReady = () => {
        playerEmit('clientReady_playerReady', {});
    }

    return (
        <Stage width={800} height={600} options={{background: 0x1099bb}}>
            {
                grid ? (<>
                        <Container>
                            {Array.from({length: grid.numberOfRows}, (_, row) =>
                                Array.from({length: grid.numberOfColumns}, (_, col) => {
                                    const cellKey = getCellKey(row, col);
                                    const isHovered = hoveredCells[cellKey] || false;

                                    return (
                                        <Container
                                            key={cellKey}
                                            x={col * cellWidth}
                                            y={row * cellHeight}
                                            interactive={true}
                                            pointerover={() =>
                                                setHoveredCells((prev) => ({...prev, [cellKey]: true}))
                                            }
                                            pointerout={() =>
                                                setHoveredCells((prev) => ({...prev, [cellKey]: false}))
                                            }
                                            pointerdown={() =>
                                                playerEmit("spawnUnit", {x: col, y: row})
                                                // alert(`You clicked cell at column ${col + 1}, row ${row + 1}`)
                                            }
                                        >
                                            <Graphics draw={(g) => drawCell(g, isHovered)}/>
                                            {
                                                hasUnitOnCell(col, row) && (
                                                    <UnitAnimatedSprite unitName="skeleton" x={16} y={16} animationSpeed={0.5}/>
                                                )
                                            }

                                            <Sprite
                                                image="/sprites/Idle.gif"
                                                scale={{ x: 0.5, y: 0.5 }}
                                                anchor={0.5}
                                                x={150}
                                                y={150}
                                            />
                                        </Container>
                                    );
                                })
                            )}
                        </Container>
                    </>
                ) : (
                    <>
                        <Button x={300} y={200} width={200} height={50} text="Player Ready"
                                onClick={handlePlayerReady}/>
                    </>
                )
            }
        </Stage>
    );
};

export default App;
