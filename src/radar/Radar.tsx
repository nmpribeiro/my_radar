import React, { useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../store/state';
import { Title } from '../components/shared/Title';
import { DISASTER_TYPE_KEY, RADAR_OPTIONS, TECH_KEY, USE_CASE_KEY } from '../constants/RadarData';
import { actions, selectors } from '../store/radar/radar.actions';

import './RadarSvg.scss';
import style from './Radar.module.scss';
import { RadarRenderUtils } from './utilities/RadarRenderUtils';
import { RadarUtilities } from './utilities/Utilities';

export const Radar = Connect<GlobalState, unknown>()
  .stateAndDispatch(
    (state) => ({
      radarData: selectors(state).radarData,
      blips: selectors(state).blips,
      rawBlips: selectors(state).rawBlips,
      useCaseFilter: selectors(state).useCaseFilter,
      disasterTypeFilter: selectors(state).disasterTypeFilter,
      techFilter: selectors(state).techFilter,
    }),
    {
      setBlips: actions.setBlips,
      setRadarData: actions.setRadarData,
      setHoveredItem: actions.setHoveredItem,
      setSelectedItem: actions.setSelectedItem,
      setSelectedQuadrant: actions.setSelectedQuadrant,
    }
  )
  .withComp(
    ({
      radarData,
      setBlips,
      blips,
      setRadarData,
      rawBlips,
      useCaseFilter,
      disasterTypeFilter,
      techFilter,
      setSelectedItem,
      setHoveredItem,
      setSelectedQuadrant,
    }) => {
      const radarRef = React.useRef<HTMLDivElement>(null);

      const [svgWidth, setSvgWidth] = useState(radarData.width);
      const [svgHeight, setSvgHeight] = useState(radarData.height);

      const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth,
      });
      React.useEffect(() => {
        function handleResize() {
          setDimensions({
            height: window.innerHeight,
            width: window.innerWidth,
          });
        }
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      });

      useEffect(() => {
        if (radarRef.current) {
          setSvgWidth(radarRef.current.clientWidth - 20);
          setSvgHeight(radarRef.current.clientHeight);
        }
      }, [radarRef.current, dimensions]);

      const [init, setInit] = useState(false);
      const [title, setTitle] = useState(radarData.title);

      const setupRadar = () => {
        if (radarRef.current && blips) {
          radarRef.current.innerHTML = '';
          let filtered = blips;
          if (useCaseFilter !== 'all') filtered = filtered.filter((i) => i[USE_CASE_KEY] === useCaseFilter);
          if (disasterTypeFilter !== 'all') filtered = filtered.filter((i) => i[DISASTER_TYPE_KEY] === disasterTypeFilter);

          const tech = radarData.tech.find((t) => t.slug === techFilter);
          if (techFilter && tech) {
            filtered = filtered.filter((i) => i[TECH_KEY] === tech.type);
            setTitle(tech.type);
          } else {
            setTitle(radarData.title);
          }

          RadarRenderUtils.setupFourQuadrants(radarRef.current, {
            blips: filtered,
            radarData,
            logic: {
              setSelectedItem,
              setHoveredItem,
              setSelectedQuadrant,
            },
          });
        }
      };

      useEffect(() => {
        if (rawBlips.length > 0 && radarData) {
          const { radarData: newRadarData, blips: newBlips } = RadarUtilities.getRadarData(rawBlips, { ...RADAR_OPTIONS });
          setBlips(newBlips);
          setRadarData({ ...newRadarData });
          setTimeout(() => {
            setInit(true);
          }, 0);
        }
      }, [rawBlips]);

      useEffect(() => {
        const newRadarData = { ...radarData };
        if (radarRef.current) {
          if (svgWidth) newRadarData.width = svgWidth;
          if (svgHeight) newRadarData.height = svgHeight;
          setRadarData(newRadarData);
        }
      }, [svgHeight, svgWidth]);

      useEffect(() => {
        if (init) setupRadar();
      }, [init, useCaseFilter, disasterTypeFilter, techFilter, svgWidth, svgHeight, radarData]);

      return (
        <>
          <Title label={title} />
          <div style={{ padding: 10 }}>
            <div className={style.techradar} ref={radarRef} />
          </div>
        </>
      );
    }
  );
