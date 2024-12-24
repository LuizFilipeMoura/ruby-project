import {AnimatedSprite} from "@pixi/react";
import {useEffect, useState} from "react";
import {Assets, Spritesheet, Texture} from "pixi.js";

export const UnitAnimatedSprite = ({unitName, x = 0, y = 0, animationSpeed}: {
    unitName: string,
    x: number,
    y: number,
    animationSpeed: number
}) => {
    const [frames, setFrames] = useState<any>();

    useEffect(() => {
        const a = async () => {
            try {
                const sheet = await Assets.load<Spritesheet>(`${unitName}/spritesheet.json`);

                setFrames(
                    Object.keys(sheet.data.frames).map(frame =>
                        Texture.from(frame)
                    )
                );
            } catch (e) {
                console.log(e)
            }
        }
        a()
    }, []);
    if (!frames) return null

    return (
        <AnimatedSprite
            x={x} y={y}
            animationSpeed={animationSpeed}
            isPlaying={true}
            textures={frames}
            anchor={0.5}
        />
    );
}
