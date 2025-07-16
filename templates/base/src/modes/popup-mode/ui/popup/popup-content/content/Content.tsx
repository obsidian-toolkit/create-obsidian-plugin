import { usePopupContext } from '@/modes/popup-mode/ui/core/PopupContext';
import ImageViewer from '@/modes/popup-mode/ui/popup/popup-content/content/ImageViewer';

import React, { FC, useEffect, useRef, useState } from 'react';

import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const Container = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    pointer-events: none;
`;

const DraggableWrapper = styled.div<{
    isDragging: boolean;
    x: number;
    y: number;
    scale: number;
}>`
    transform: translate(${(props) => props.x}px, ${(props) => props.y}px)
        scale(${(props) => props.scale});
    cursor: ${(props) => (props.isDragging ? 'grabbing' : 'grab')};
    pointer-events: auto;
    transition: ${(props) =>
        props.isDragging ? 'none' : 'transform 0.2s ease'};
    transform-origin: center;
`;

const Content: FC = () => {
    const { images, activeImageIndex } = usePopupContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    const calculateInitialScale = () => {
        if (!containerRef.current || !imageRef.current) return 1;

        const container = containerRef.current;
        const image = images[activeImageIndex];

        if (!image) return 1;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        let imageWidth: number;
        let imageHeight: number;

        if (image instanceof HTMLImageElement) {
            imageWidth = image.naturalWidth;
            imageHeight = image.naturalHeight;
        } else {
            const rect = image.getBoundingClientRect();
            imageWidth = rect.width;
            imageHeight = rect.height;
        }

        const padding = 40;
        const availableWidth = containerWidth - padding;
        const availableHeight = containerHeight - padding;

        const scaleX = availableWidth / imageWidth;
        const scaleY = availableHeight / imageHeight;

        const autoScale = Math.min(scaleX, scaleY, 1);

        return autoScale;
    };

    useEffect(() => {
        setPosition({ x: 0, y: 0 });
        setDragStart({ x: 0, y: 0 });

        setTimeout(() => {
            const initialScale = calculateInitialScale();
            setScale(initialScale);
        }, 50);
    }, [activeImageIndex]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        const zoomFactor = 0.1;
        const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;

        setScale((prev) => {
            const newScale = prev + delta;
            return Math.max(0.1, Math.min(5, newScale));
        });
    };

    useEffect(() => {
        document.addEventListener('wheel', handleWheel);
        return () => {
            document.removeEventListener('wheel', handleWheel);
        };
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
        return () => {};
    }, [isDragging, dragStart]);

    return (
        <Container ref={containerRef}>
            <DraggableWrapper
                isDragging={isDragging}
                x={position.x}
                y={position.y}
                scale={scale}
                onMouseDown={handleMouseDown}
            >
                <div ref={imageRef}>
                    <ImageViewer img={images[activeImageIndex]} />
                </div>
            </DraggableWrapper>
        </Container>
    );
};

export default Content;
