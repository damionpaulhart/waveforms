// @flow
import React from 'react';
import styled from 'styled-components';

import {
  COLORS,
  DEFAULT_WAVEFORM_SIZE,
  WAVEFORM_ASPECT_RATIO,
} from '../../constants/index';
import { range } from '../../utils';

import Aux from '../Aux';
import FadeTransition from '../FadeTransition';

import type { Linecap } from '../../types';

const TOP_AXIS_SPACING = 15;
const SIDE_AXIS_SPACING = 10;

type Props = {
  y: boolean,
  x: boolean,
  waveformSize?: number,
  color: string,
  strokeWidth: number,
  strokeLinecap: Linecap,
  numOfCycles: number,
  progress: number,
  showLabels: boolean,
};

const WaveformAxis = ({
  y = false,
  x = false,
  waveformSize = DEFAULT_WAVEFORM_SIZE,
  color = COLORS.gray[700],
  strokeWidth = 2,
  strokeLinecap,
  numOfCycles,
  progress,
  showLabels,
}: Props) => {
  // This represents a single axis. Only one of x/y may be passed.
  // I may create a thin wrapper that supplies both, but I like being able to
  // control their line styles individually. It gets messy otherwise.
  if (x && y) {
    throw new Error(
      'You provided both `x` and `y`, but these are mutually exclusive. Please supply a single axis to render to WaveformAxis'
    );
  }

  if (!x && !y) {
    throw new Error(
      'You need to specify either `x` or `y` for WaveformAxis. Which axis do you wish to show?'
    );
  }

  // We want our axes to have some "breathing room" around the waveform.
  // It would be inconvenient to need to position the waveform explicitly,
  // though.
  //
  // Happily, a semi-hacky workaround has presented itself.
  //
  // These axes will be positioned absolutely, and they will overflow their
  // parent. If they're placed in a 200x200 container, they'll actually take
  // up 220x230px space, spilling out over all 4 sides.
  //
  // This works because this project doesn't need the axes to be specifically
  // positioned; they'll be floating around in their own area. This trick
  // wouldn't work in most situations, but it does here.

  const width = waveformSize;
  const height = waveformSize * WAVEFORM_ASPECT_RATIO;

  const axisWidth = width + SIDE_AXIS_SPACING * 2;
  const axisHeight = height + TOP_AXIS_SPACING * 2;

  const halfHeight = Math.round(height / 2);

  const showXLabels = x && showLabels;

  return (
    <WaveformAxisSvg width={width} height={height}>
      <FadeTransition isVisible={showXLabels} typeName="g">
        {range(0, numOfCycles, 0.5).map(i => {
          return (
            <Aux key={i}>
              <line
                x1={width * i}
                y1={0}
                x2={width * i}
                y2={height}
                stroke="rgba(0, 0, 0, 0.5)"
                strokeDasharray={5}
              />
              <text
                x={width * i + 3}
                y={height / 2 + 20}
                style={{ fontSize: 14 }}
              >
                {i}s
              </text>
            </Aux>
          );
        })}
      </FadeTransition>

      {x ? (
        <line
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          x1={-SIDE_AXIS_SPACING}
          y1={halfHeight}
          x2={axisWidth}
          y2={halfHeight}
        />
      ) : (
        <line
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          x1={0}
          y1={-TOP_AXIS_SPACING}
          x2={0}
          y2={axisHeight}
        />
      )}
    </WaveformAxisSvg>
  );
};

const WaveformAxisSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: ${props => props.width + 'px'};
  height: ${props => props.height + 'px'};
  overflow: visible;
`;

export default WaveformAxis;