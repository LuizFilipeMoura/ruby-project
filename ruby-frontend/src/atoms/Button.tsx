import React from 'react';
import { Container, Text, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';

interface ButtonProps {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ x, y, width, height, text, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const drawButton = React.useCallback(
        (g: PIXI.Graphics) => {
            g.clear();

            // Button background color
            g.beginFill(isHovered ? 0xffcc00 : 0x0099ff);
            g.drawRoundedRect(0, 0, width, height, 10); // x, y, width, height, corner radius
            g.endFill();

            // Button border
            g.lineStyle(2, 0xffffff, 1);
            g.drawRoundedRect(0, 0, width, height, 10);
        },
        [isHovered, width, height]
    );

    return (
        <Container
            x={x}
            y={y}
            interactive={true}
            pointerover={() => setIsHovered(true)}
            pointerout={() => setIsHovered(false)}
            pointerdown={onClick}
        >
            <Graphics draw={drawButton} />
            <Text
                text={text}
                anchor={0.5}
                x={width / 2}
                y={height / 2}
                style={{
                    fontSize: 16,
                    fill: '#ffffff',
                    fontWeight: 'bold',
                } as PIXI.TextStyle}
            />
        </Container>
    );
};


