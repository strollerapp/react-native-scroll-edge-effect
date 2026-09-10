import { describe, expect, it } from '@jest/globals';

import { getContainerStyle } from '../styles';

describe('getContainerStyle', () => {
  it('pins to the top edge', () => {
    expect(getContainerStyle({ edge: 'top', height: 64 })).toEqual({
      position: 'absolute',
      left: 0,
      right: 0,
      height: 64,
      top: 0,
    });
  });

  it('pins to the bottom edge', () => {
    expect(getContainerStyle({ edge: 'bottom', height: 96 })).toEqual({
      position: 'absolute',
      left: 0,
      right: 0,
      height: 96,
      bottom: 0,
    });
  });
});
