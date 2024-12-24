import './App.css';
import {AnimatedSprite, Container, Graphics, Sprite, Stage, Text} from '@pixi/react';
import * as PIXI from 'pixi.js';
import '@pixi/events';

import {Event, playerEmit, useSocketEvents} from './hooks/useSocketEvents';
import {Grid} from "./models/grid.ts";
import {useEffect, useState} from "react";
import {Button} from "./atoms/Button.tsx";
import {GameState} from "./models/gameState.ts";
import {Assets, Spritesheet, Texture} from 'pixi.js';




const cellWidth = 50; // Width of each cell
const cellHeight = 50; // Height of each cell

const App = () => {

    const [frames, setFrames] = useState<any>();

    // useEffect(() => {
    //     const a = async () => {
    //         try {
    //             const sheet = await Assets.load<Spritesheet>('spritesheet.json');
    //             console.log(sheet);
    //             console.log("Object.keys(sheet.data.frames)", Object.keys(sheet.data.frames))
    //             setFrames(
    //                 Object.keys(sheet.data.frames).map(frame =>
    //                     Texture.from(frame)
    //                 )
    //             );
    //         }catch (e) {
    //          console.log(e)
    //         }
    //
    //     }
    //     a()
    // }, []);


    useEffect(() => {
        console.log("frames", frames);
    }, [frames]);
    const [grid, setGrid] = useState<Grid>();
    const events: Event[] = [
        {
            name: 'completeGameStateTick',
            handler(message: GameState) {
                const {grid, units} = message;
                console.log("units", units);
                setGrid(grid);
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
                                            {/*<Text*/}
                                            {/*    text={`${col },${row }`}*/}
                                            {/*    x={cellWidth / 2}*/}
                                            {/*    y={cellHeight / 2}*/}
                                            {/*    anchor={0.5}*/}
                                            {/*    style={{*/}
                                            {/*        fontSize: 12,*/}
                                            {/*        fill: '#ffffff',*/}
                                            {/*    }}*/}
                                            {/*/>*/}
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
                        {
                            frames && (
                                <Container x={300} y={200}>
                                    {/*<AnimatedSprite*/}
                                    {/*    x={0} y={200}*/}

                                    {/*    animationSpeed={0.5}*/}
                                    {/*    isPlaying={true}*/}
                                    {/*    images={}*/}
                                    {/*    anchor={0.5}*/}
                                    {/*/>*/}
                                    <Button x={0} y={200} width={200} height={50} text="Player aaaaaaaaa"
                                            onClick={handlePlayerReady}/>
                                </Container>
                            )
                        }
                        <AnimatedSprite
                            animationSpeed={0.05}
                            isPlaying={true}
                            images={["image.png", "image2.png"]}
                            anchor={0.5}
                        />
                        <Button x={300} y={200} width={200} height={50} text="Player Ready"
                                onClick={handlePlayerReady}/>
                        {/*<Button x={300} y={250} width={200} height={50} text="Load grid"*/}
                        {/*        onClick={handleLoadGridButton}/>*/}
                    </>
                )
            }
        </Stage>
    );
};

export default App;
