import React from 'react';

import { Title } from '../shared/Title';
import { RadarContext } from '../../services/RadarContext';

import { TechItem } from './TechItem';

export const TechList: React.FC = () => {
  const radarContext = React.useContext(RadarContext);
  return (
    <div>
      <Title label="Technologies" />
      {/* TODO: tech list! {children} */}
      {radarContext.data.tech.map((tech) => (
        <TechItem key={tech.uuid} tech={tech} />
      ))}
    </div>
  );
};
