import React, { useEffect } from 'react';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../../store/state';
import { actions, selectors } from '../../store/radar/radar.actions';

import styles from './BlipPage.module.scss';

export const BlipPage = Connect<GlobalState>()
  .stateAndDispatch(
    (state) => ({
      selectedItem: selectors(state).selectedItem,
    }),
    {
      setSelectedItem: actions.setSelectedItem,
    }
  )
  .withComp(({ selectedItem, setSelectedItem }) => {
    useEffect(() => {
      // eslint-disable-next-line no-console
      console.log('selectedItem', selectedItem);
    }, [selectedItem]);

    const onBackClick = () => setSelectedItem(null);

    return (
      <div>
        {selectedItem && (
          <div>
            <div style={{ position: 'absolute', top: 20, left: 0 }}>
              <button type="button" onClick={onBackClick} className={styles.button}>
                <span style={{ fontSize: 30 }}>&#10094;</span>
              </button>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ justifyContent: 'center', flex: 1 }}>
                <h1 className={styles.title}>{selectedItem.Title}</h1>
              </div>
            </div>

            <div style={{ display: 'flex' }} className={styles.wrapper}>
              <div style={{ flexDirection: 'column', flex: 1 }}>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Title</h4>
                  <div className={styles.paragraph}>{selectedItem.Title}</div>
                </div>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Summary</h4>
                  <div className={styles.paragraph}>{selectedItem.Summary}</div>
                </div>

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Description</h4>
                  <div className={styles.paragraph}>{selectedItem.Description}</div>
                </div>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Level of implementation</h4>
                  <div className={styles.paragraph}>{selectedItem['Level of implementation']}</div>
                </div>

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Description</h4>
                  <div className={styles.paragraph}>{selectedItem.Description}</div>
                </div>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Origin</h4>
                  <div className={styles.paragraph}>{selectedItem.Origin}</div>
                </div>

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Technology</h4>
                  <div className={styles.paragraph}>{selectedItem.Technology}</div>
                </div>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Data</h4>
                  <div className={styles.paragraph}>{selectedItem.Data}</div>
                </div>
              </div>

              <div style={{ flexDirection: 'column', flex: 1 }}>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Use case</h4>
                  <div className={styles.paragraph}>{selectedItem['Use case']}</div>
                </div>

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Source</h4>
                  <div className={styles.paragraph}>{selectedItem.Source}</div>
                </div>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>SDG goal</h4>
                  <div className={styles.paragraph}>{selectedItem['SDG goal']}</div>
                </div>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Organization</h4>
                  <div className={styles.paragraph}>{selectedItem.Organization}</div>
                </div>

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Developer</h4>
                  <div className={styles.paragraph}>{selectedItem.Developer}</div>
                </div>

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Implementer</h4>
                  <div className={styles.paragraph}>{selectedItem.Implementer}</div>
                </div>

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Partner</h4>
                  <div className={styles.paragraph}>{selectedItem.Partner}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });
