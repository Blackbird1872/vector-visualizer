import React, { useState, useRef, useLayoutEffect, useMemo, useCallback } from 'react'
import { useWindowDimensions } from '../hooks/useWindowDimensions'

const XAxis = ({ y, width, stroke, strokeWidth }) => {
    return <path 
        d={`M 0 ${y} L ${width} ${y}`} 
        stroke={stroke}
        strokeWidth={strokeWidth}
    />
}

const YAxis = ({ x, height, stroke, strokeWidth }) => {
    return <path
        d={`M ${x} 0 L ${x} ${height}`}
        stroke={stroke}
        strokeWidth={strokeWidth}
    />
}

const XGridline = ({ gridX, getPos, axisY, height, width, stroke, strokeWidth, label, labelOffsetY, labelOffsetBottom, axisLabelMargin, showLabel }) => {
    const xPos = getPos(gridX, null).x
    return <React.Fragment>
        <path
            d={`M ${xPos} 0 L ${xPos} ${width}`}
            stroke={stroke}
            strokeWidth={strokeWidth}
        />
        {showLabel && (
            <text
                x={xPos}
                y={(axisY < height - axisLabelMargin) ? axisY + labelOffsetY : height - labelOffsetBottom}
                textAnchor='middle'
            >{label}</text>
        )}
    </React.Fragment>
}

const YGridline = ({ gridY, getPos, axisX, height, width, stroke, strokeWidth, label, yAxisRef, yAxisWidth, labelOffsetX, labelPadding, showLabel }) => {
    const yPos = getPos(null, gridY).y
    return <React.Fragment>
        <path
            d={`M 0 ${yPos} L ${width} ${yPos}`}
            stroke={stroke}
            strokeWidth={strokeWidth}
        />
        {showLabel && (
            <text ref={yAxisRef}
                x={Math.max(axisX - labelOffsetX, (yAxisWidth || 0) + labelPadding)}
                y={yPos}
                textAnchor='end'
                dominantBaseline='middle'
            >{label}</text>
        )}
    </React.Fragment>
}

const Vector = ({ 
    vector: { xStart, yStart, xEnd, yEnd }, 
    getPos, 
    color
}) => {
    const start = getPos(xStart, yStart);
    const end = getPos(xEnd, yEnd);
    return <React.Fragment>
        <defs>
            <marker
                id='vectorHead'
                viewBox='0 0 10 10'
                refX={10}
                refY={5}
                markerWidth={6}
                markerHeight={6}
                orient='auto-start-reverse'
            >
                <path d='M 0 0 L 10 5 L 0 10 z' />
            </marker>
        </defs>

        <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke='black'
            markerEnd='url(#vectorHead)'
        />
    </React.Fragment>
}

const Grid = ({
    width='w-full',
    height='h-full',
    gridlineStroke='grey',
    gridlineStrokeWidth=1,
    majorGridlineStroke='dimgrey',
    axisStroke='black',
    axisStrokeWidth=3,
    vectors=[]
}) => {
    const DEFAULT_CELL_SIZE = 15;
    const LABEL_OFFSET_Y = 20;
    const LABEL_OFFSET_BOTTOM = 10;
    const LABEL_OFFSET_X = 7;
    const LABEL_PADDING = 10;
    const AXIS_LABEL_MARGIN = 30;

    const dimensions = useWindowDimensions()
    const [cellState, setCellState] = useState({
        scale: 2,
        unitSize: 1,
        majorLines: 5,
        mult: 1,
    })
    const [axisPos, setAxisPos] = useState({x: dimensions.width / 2, y: dimensions.height / 2});

    const cellSize = DEFAULT_CELL_SIZE * cellState.scale;

    const getPos = useCallback((x=null, y=null) => {
        return {
            x: x!== null ? axisPos.x + (x * cellSize) / (cellState.unitSize * cellState.mult) : null,
            y: y!==null ? axisPos.y - (y * cellSize) / (cellState.unitSize * cellState.mult) : null
        };
    }, [axisPos.x, axisPos.y, cellState, cellSize])

    const yAxisRefs = useRef({})
    const [yAxisWidths, setYAxisWidths] = useState({})

    useLayoutEffect(() => {
        const widths = {};
        Object.entries(yAxisRefs.current).forEach(([key, el]) => {
            if (el) {
                widths[key] = el.getBBox().width;
            }
        });
        setYAxisWidths(widths);
    }, [axisPos.x, axisPos.y, dimensions.width, dimensions.height])

    const THROTTLE_MS = 16 // ~60fps
    const lastScrollTime = useRef(0)

    const handleMouseScroll = useCallback((e) => {
        e.preventDefault()

        const now = Date.now()
        if (now - lastScrollTime.current < THROTTLE_MS) return;
        lastScrollTime.current = now;

        let scaleFactor = 1;

        setCellState(prevState => {
            const oldCellSize = DEFAULT_CELL_SIZE * prevState.scale;
            let scale = prevState.scale - (e.deltaY * 0.1) / DEFAULT_CELL_SIZE;
            let unitSize = prevState.unitSize;
            let majorLines = prevState.majorLines;
            let mult = prevState.mult;

            while (true) {
                if (unitSize == 1) { // Default scale = 2 majorLines = 5
                    if (scale >= 4) { // Zoom in
                        unitSize = 5;
                        majorLines = 5;
                        scale /= 2;
                        mult /= 10;
                    }

                    else if (scale <= 1) { // Zoom out
                        unitSize = 2;
                        scale *= 2;
                    }

                    if (scale >= 1 && scale <= 4) { // Check if zoom good
                        break;
                    }
                }

                if (unitSize == 2) { // Default scale = 2 majorLines = 5
                    if (scale >= 4) { // Zoom in
                        unitSize = 1;
                        scale /= 2;
                    }

                    else if (scale <= 1) { // Zoom out
                        unitSize = 5;
                        scale *= 2.5;
                        majorLines = 4;
                    }

                    if (scale >= 1 && scale <= 4) { // Check if zoom good
                        break;
                    }
                }

                if (unitSize == 5) { // Default scale = 2.5 majorLines = 4
                    if (scale >= 4) { // Zoom in
                        unitSize = 2;
                        scale /= 2.5;
                        majorLines = 5;
                    }

                    else if (scale <= 1) { // Zoom out
                        unitSize = 1;
                        scale *= 2;
                        majorLines = 5;
                        mult *= 10;
                    }

                    if (scale >= 1 && scale <= 4) { // Check if zoom good
                        break;
                    }
                }
            }
            
            const oldGridSpacing = oldCellSize / (prevState.unitSize * prevState.mult);
            const newGridSpacing = (DEFAULT_CELL_SIZE * scale) / (unitSize * mult);
            scaleFactor = newGridSpacing / oldGridSpacing;
            
            return {
                ...prevState,
                scale,
                unitSize,
                majorLines,
                mult
            };
        })

        setAxisPos(prevState => {
            return {
                x: prevState.x - (scaleFactor - 1) * (e.clientX - prevState.x),
                y: prevState.y - (scaleFactor - 1) * (e.clientY - prevState.y)
            }
        })
    }, [])
 
    const [dragState, setDragState] = useState({ 
        isDragging: false, 
        x: null, 
        y: null 
    })

    const lastMoveTime = useRef(0)

    const handleMouseDown = (e) => {
        setDragState({ 
            isDragging: true, 
            x: e.clientX, 
            y: e.clientY 
        })
    }

    const handleMouseMove = useCallback((e) => {
        if (!dragState.isDragging) return;

        const now = Date.now()
        if (now - lastMoveTime.current < THROTTLE_MS) return;
        lastMoveTime.current = now

        setAxisPos({
            x: (axisPos.x + e.clientX - dragState.x),
            y: (axisPos.y + e.clientY - dragState.y)
        })

        setDragState({
            isDragging: true,
            x: e.clientX,
            y: e.clientY
        })
    }, [dragState.isDragging, dragState.x, dragState.y, axisPos.x, axisPos.y])

    const xGridlines = useMemo(() => {
        const gridlines = [];
        for (let i = 1; getPos((i-2) * cellState.unitSize * cellState.mult, null).x < dimensions.width; i++) {
            const isMajor = i % cellState.majorLines === 0;
            gridlines.push(
                <XGridline key={i}
                    gridX={i * cellState.unitSize * cellState.mult}
                    getPos={getPos}
                    axisY={axisPos.y}
                    height={dimensions.height}
                    width={dimensions.width}
                    stroke={isMajor ? majorGridlineStroke : gridlineStroke}
                    strokeWidth={isMajor ? gridlineStrokeWidth + 1 : gridlineStrokeWidth}
                    label={Math.round(i * cellState.unitSize * cellState.mult * 1e10) / 1e10}
                    labelOffsetY={LABEL_OFFSET_Y}
                    labelOffsetBottom={LABEL_OFFSET_BOTTOM}
                    axisLabelMargin={AXIS_LABEL_MARGIN}
                    showLabel={isMajor}
                />
            );
        }

        for (let i = -1; getPos((i+2) * cellState.unitSize * cellState.mult, null).x > 0; i--) {
            const isMajor = i % cellState.majorLines === 0;
            gridlines.push(
                <XGridline key={i}
                    gridX={i * cellState.unitSize * cellState.mult}
                    getPos={getPos}
                    axisY={axisPos.y}
                    height={dimensions.height}
                    width={dimensions.width}
                    stroke={isMajor ? majorGridlineStroke : gridlineStroke}
                    strokeWidth={isMajor ? gridlineStrokeWidth + 1 : gridlineStrokeWidth}
                    label={Math.round(i * cellState.unitSize * cellState.mult * 1e10) / 1e10}
                    labelOffsetY={LABEL_OFFSET_Y}
                    labelOffsetBottom={LABEL_OFFSET_BOTTOM}
                    axisLabelMargin={AXIS_LABEL_MARGIN}
                    showLabel={isMajor}
                />
            );
        };

        return gridlines;
    }, [
        getPos,
        dimensions.width,
        dimensions.height, 
        axisPos.y, 
        gridlineStroke,
        majorGridlineStroke, 
        gridlineStrokeWidth,
        cellState
    ])

    const yGridlines = useMemo(() => {
        const gridlines = [];
        for (let i = 1; getPos(null, (i-2) * cellState.unitSize * cellState.mult).y > 0; i++) {
            const isMajor = i % cellState.majorLines === 0;
            gridlines.push(
                <YGridline key={i}
                    gridY={i * cellState.unitSize * cellState.mult}
                    getPos={getPos}
                    axisX={axisPos.x}
                    height={dimensions.height}
                    width={dimensions.width}
                    stroke={isMajor ? majorGridlineStroke : gridlineStroke}
                    strokeWidth={isMajor ? gridlineStrokeWidth + 1 : gridlineStrokeWidth}
                    label={Math.round(i * cellState.unitSize * cellState.mult * 1e10) / 1e10}
                    yAxisRef={el => yAxisRefs.current[i] = el}
                    yAxisWidth={yAxisWidths[i]}
                    labelOffsetX={LABEL_OFFSET_X}
                    labelPadding={LABEL_PADDING}
                    showLabel={isMajor}
                />
            );
        };

        for (let i = -1; getPos(null, (i+2) * cellState.unitSize * cellState.mult).y < dimensions.height; i--) {
            const isMajor = i % cellState.majorLines === 0;
            gridlines.push(
                <YGridline key={i}
                    gridY={i * cellState.unitSize * cellState.mult}
                    getPos={getPos}
                    axisX={axisPos.x}
                    height={dimensions.height}
                    width={dimensions.width}
                    stroke={isMajor ? majorGridlineStroke : gridlineStroke}
                    strokeWidth={isMajor ? gridlineStrokeWidth + 1 : gridlineStrokeWidth}
                    label={Math.round(i * cellState.unitSize * cellState.mult * 1e10) / 1e10}
                    yAxisRef={el => yAxisRefs.current[i] = el}
                    labelOffsetX={LABEL_OFFSET_X}
                    labelPadding={LABEL_PADDING}
                    showLabel={isMajor}
                />
            )
        }

        return gridlines
    }, [
        getPos,
        dimensions.width,
        dimensions.height, 
        axisPos.x, 
        gridlineStroke,
        majorGridlineStroke, 
        gridlineStrokeWidth, 
        yAxisWidths,
        cellState
    ])

    const vectorComponents = useMemo(() => {
        return vectors.map((vector, index) => (
            <Vector key={index}
                vector={vector}
                getPos={getPos}
            />
        ));
    }, [vectors, getPos])

    return (
        <div className={`${width} ${height}`}>
            <svg
                className={`graph ${dragState.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                width={"100%"}
                height={"100%"}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setDragState({ isDragging: false, x: null, y: null })}
                onWheel={handleMouseScroll}
            >   
                {xGridlines}
                {yGridlines}

                <XAxis 
                    y={axisPos.y}
                    width={dimensions.width}
                    stroke={axisStroke}
                    strokeWidth={axisStrokeWidth}
                />
                <YAxis
                    x={axisPos.x}
                    height={dimensions.height}
                    stroke={axisStroke}
                    strokeWidth={axisStrokeWidth}
                />

                {vectorComponents}
            </svg>
        </div>
    )
}

export default Grid