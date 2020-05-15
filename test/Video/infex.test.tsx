import React from 'react';

import { render, fireEvent, waitForElement } from '@testing-library/react';
import { MediaProvider, MediaConsumer, Video } from '../../src';
import { getElement } from '../utils';

describe('video', () => {
  it('should work', async () => {
    const mocknVolumeChange = jest.fn();
    const { getByText, container } = render(
      <MediaProvider>
        <Video onVolumeChange={mocknVolumeChange} />
      </MediaProvider>
    );

    const videoElement = getElement(container, 'video');

    videoElement.muted = true;
    expect(mocknVolumeChange).toHaveBeenCalledTimes(1);
  });
});
