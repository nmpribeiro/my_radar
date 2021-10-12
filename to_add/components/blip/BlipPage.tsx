import React from 'react';

import { RadarContext } from '../../RadarProvider';
import { UnorderedList } from '../shared/UnorderedList';
import { actions } from '../../redux/radar/radar.actions';
import { RadarStateLabel } from '../../redux/radar/radar.state';
import { HORIZONS_KEY, TITLE_KEY } from '../../constants/RadarConstants';

import styles from './BlipPage.module.scss';

export const BlipPage: React.FC = () => {
  const {
    state: {
      [RadarStateLabel.STATE]: { radarData, selectedItem },
    },
    dispatch,
  } = React.useContext(RadarContext);
  return (
    <div>
      {selectedItem && (
        <div>
          <div style={{ position: 'absolute', top: 20, left: 0 }}>
            <button type="button" onClick={() => dispatch(actions.setSelectedItem(null))} className={styles.button}>
              <span style={{ fontSize: 30 }}>&#10094;</span>
            </button>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ justifyContent: 'center', flex: 1 }}>
              <h1 className={styles.title}>{selectedItem[TITLE_KEY]}</h1>
            </div>
          </div>

          <div style={{ display: 'flex' }} className={styles.wrapper}>
            <div style={{ flexDirection: 'column', flex: 1 }}>
              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Title</h4>
                <div className={styles.paragraph}>{selectedItem[TITLE_KEY]}</div>
              </div>
              {/* <div style={{ flexDirection: 'row', flex: 1 }}>
              <h4>Summary</h4>
              <div className={styles.paragraph}>{selectedItem.Summary}</div>
            </div> */}

              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Description</h4>
                <div className={styles.paragraph}>{selectedItem.Description}</div>
              </div>
              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Level of implementation</h4>
                <div className={styles.paragraph}>{selectedItem[HORIZONS_KEY]}</div>
              </div>

              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Description</h4>
                <div className={styles.paragraph}>{selectedItem.Description}</div>
              </div>
              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Un Host Organisation</h4>
                <div className={styles.paragraph}>{selectedItem['Un Host Organisation']}</div>
              </div>

              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Technology</h4>
                <div className={styles.paragraph}>
                  <UnorderedList array={selectedItem.Technology} itemStyle={{ display: 'flex', marginBottom: 2 }}>
                    {(item) => {
                      const backgroundColor = radarData.tech.find((t) => t.type === item)?.color;
                      return (
                        <>
                          <div style={{ backgroundColor, width: 20, height: 20, marginRight: 10, marginLeft: 20 }} />
                          {item}
                        </>
                      );
                    }}
                  </UnorderedList>
                </div>
              </div>
              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Data</h4>
                <div className={styles.paragraph}>{selectedItem.Data}</div>
              </div>
            </div>

            <div style={{ flexDirection: 'column', flex: 1 }}>
              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Use case</h4>
                <div className={styles.paragraph}>{selectedItem['Use Case']}</div>
              </div>

              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Source</h4>
                <div className={styles.paragraph}>
                  {selectedItem.Source === 'No Information' && selectedItem.Source}
                  {selectedItem.Source !== 'No Information' && (
                    <a href={selectedItem.Source as string} target="_blank" rel="noreferrer">
                      {selectedItem.Source}
                    </a>
                  )}
                </div>
              </div>
              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>SDG goal(s)</h4>
                <div className={styles.paragraph}>
                  <UnorderedList array={selectedItem.SDG} />
                </div>
              </div>
              {/* <div style={{ flexDirection: 'row', flex: 1 }}>
              <h4>Organization</h4>
              <div className={styles.paragraph}>{selectedItem.Organization}</div>
            </div>

            <div style={{ flexDirection: 'row', flex: 1 }}>
              <h4>Developer</h4>
              <div className={styles.paragraph}>{selectedItem.Developer}</div>
            </div> */}

              {/* <div style={{ flexDirection: 'row', flex: 1 }}>
              <h4>Implementer</h4>
              <div className={styles.paragraph}>{selectedItem.Implementer}</div>
            </div> */}

              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Partner</h4>
                <div className={styles.paragraph}>{selectedItem['Supporting Partners']}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
