import React, { useEffect } from 'react';

import { RadarContext } from '../RadarProvider';
import { RADAR_OPTIONS } from '../constants/RadarConstants';
import { RadarUtilities } from './utilities/RadarUtilities';
import { RadarStateLabel } from '../redux/radar/radar.state';
import { actions } from '../redux/radar/radar.actions';
import { DataStateLabel } from '../redux/data/data.state';

export const RadarDataGenerator: React.FC = ({ children }) => {
  const {
    state: {
      [RadarStateLabel.STATE]: {
        //
        rawBlips,
        radarData,
      },
      [DataStateLabel.STATE]: { horizonOrder, quadrantOrder },
    },
    dispatch,
  } = React.useContext(RadarContext);

  // rawBlips, radarData, setBlips, setRadarData

  useEffect(() => {
    if (rawBlips.length > 0 && radarData) {
      const { radarData: newRadarData, blips: newBlips } = RadarUtilities.getRadarData(
        rawBlips,
        { ...RADAR_OPTIONS },
        { horizonOrder, quadrantOrder }
      );
      dispatch(actions.setBlips(newBlips));
      dispatch(actions.setRadarData({ ...newRadarData }));
    }
  }, [rawBlips]);
  return <>{children}</>;
};
// export const RadarDataGenerator = Connect<GlobalState>()
//   .stateAndDispatch(
//     (state) => ({
//       rawBlips: selectors(state).rawBlips,
//       radarData: selectors(state).radarData,
//     }),
//     { setBlips: actions.setBlips, setRadarData: actions.setRadarData }
//   )
//   .withComp(({ children, rawBlips, radarData, setBlips, setRadarData }) => {
//     useEffect(() => {
//       if (rawBlips.length > 0 && radarData) {
//         const { radarData: newRadarData, blips: newBlips } = RadarUtilities.getRadarData(rawBlips, { ...RADAR_OPTIONS });
//         setBlips(newBlips);
//         setRadarData({ ...newRadarData });
//       }
//     }, [rawBlips]);
//     return <>{children}</>;
//   });
