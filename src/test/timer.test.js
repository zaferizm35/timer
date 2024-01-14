// Timer.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from '@testing-library/react';
import Timer from '../components/Timer/Timer';
import { waitFor } from '@testing-library/react';
import TimerButton from '../components/TimerButton/TimerButton';


jest.useFakeTimers(); // We are using fakeTimer
jest.spyOn(global, 'clearInterval'); 

// Timer Unit Tests
describe('Timer Unit Tests', () => {
  afterEach(() => {
    jest.clearAllTimers(); // After Every test , clear Timer
  });

  

  test('When App start , It shows 25;00', () => {
    const { getByText } = render(<Timer />);
    expect(getByText('25:00')).toBeInTheDocument();
  });

  test('When click timer button , Timer starts', () => {
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(1000); // Count down 1 seconds
    expect(getByText('24:59')).toBeInTheDocument();
  });

  test('"STOP" button is working when pressed', () => {
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(3000); // 3 seconds count down
    fireEvent.click(getByText('Stop'));
    
    expect(global.clearInterval).toHaveBeenCalledTimes(1);
  });

  test('When press reset button , You should see 25:00', () => {
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(5000); // 5 seconds count down
    fireEvent.click(getByText('Reset'));
    expect(getByText('25:00')).toBeInTheDocument();
  });
});

// TimerButton Unit Tests
describe('TimerButton Unit Tests', () => {
  test('TimerButton is starting', () => {
    const mockFunction = jest.fn();
    const { getByText } = render(<TimerButton buttonAction={mockFunction} buttonValue="Test" />);
    expect(getByText('Test')).toBeInTheDocument();
  });

  test(' When press TimerButton component ,Action is triggered', () => {
    const mockFunction = jest.fn();
    const { getByText } = render(<TimerButton buttonAction={mockFunction} buttonValue="Test" />);

    fireEvent.click(getByText('Test'));
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});

// Timer and TimerButton integration  tests
describe('Timer and TimerButton integration  tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  test('When press 2 times to Start button , Timer doesnt stop', () => {
    const { getByText } = render(<Timer />);
    const startButton = getByText('Start');

    // First press
    fireEvent.click(startButton);
    
    // Timer start
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check timer
    expect(getByText('24:59')).toBeInTheDocument();

    // Take the timer time
    const initialValue = getByText('24:59').textContent;

    // Press second time
    fireEvent.click(startButton);

    //Timer starts
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Timer shouldnt be stop
    expect(getByText('24:58')).toBeInTheDocument();
    // 1. time and 2. time is not equal
    expect(getByText('24:58').textContent).not.toEqual(initialValue);
  });

  test('when press start buton it should start and when press stop button timer should stop', async () => {
    const { getByText } = render(<Timer />);
    const startButton = getByText('Start');
    const stopButton = getByText('Stop');

    // Start timer
    fireEvent.click(startButton);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(getByText('24:59')).toBeInTheDocument();
    });
    // Timer value should change
    expect(getByText('24:59')).toBeInTheDocument();

    // Stop timer
    fireEvent.click(stopButton);
    const lastTimeValue = getByText('24:59').textContent;

    // Count down 1 seconds
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Check if timer changed
    expect(getByText(lastTimeValue)).toBeInTheDocument();
  });

  test('When press reset , you should get 25:00', () => {
    const { getByText } = render(<Timer />);
    const startButton = getByText('Start'); const resetButton = getByText('Reset');

    // Start timer
    fireEvent.click(startButton);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Press reset button
    fireEvent.click(resetButton);
    
    // Check after pressing Reset Button
    expect(getByText('25:00')).toBeInTheDocument();
    }); 
  });