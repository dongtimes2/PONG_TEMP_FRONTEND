import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import Loading from '../Loading';

describe('Loading component test', () => {
  it('상대방을 기다리는 중. 이라는 문구가 떠야 합니다', () => {
    render(<Loading />);
    expect(screen.getByText('상대방을 기다리는 중.')).toBeInTheDocument();
  });

  it('300ms가 지난 후에는 점이 하나 추가되어야 합니다', () => {
    jest.useFakeTimers();
    render(<Loading />);

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.getByText('상대방을 기다리는 중..')).toBeInTheDocument();
  });

  it('600ms가 지난 후에는 점이 두 개 추가되어야 합니다', () => {
    jest.useFakeTimers();
    render(<Loading />);

    act(() => {
      jest.advanceTimersByTime(600);
    });
    expect(screen.getByText('상대방을 기다리는 중...')).toBeInTheDocument();
  });

  it('900ms가 지난 후에는 점이 사라져야 합니다', () => {
    jest.useFakeTimers();
    render(<Loading />);

    act(() => {
      jest.advanceTimersByTime(900);
    });
    expect(screen.getByText('상대방을 기다리는 중')).toBeInTheDocument();
  });
});
