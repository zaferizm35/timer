// Timer.test.js

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Timer from '../components/Timer/Timer';
import TimerButton from '../components/TimerButton/TimerButton'; 

// Timer Birim Testleri
describe('Timer Birim Testleri', () => {
  test('Timer komponenti render ediliyor ve başlangıçta 25:00 gösteriyor', () => {
    const { getByText } = render(<Timer />);
    expect(getByText('25:00')).toBeInTheDocument();
  });

  test('Başlat butonuna tıklanınca timer başlıyor', () => {
    jest.useFakeTimers();
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(1000); // 1 saniye ilerlet
    expect(getByText('24:59')).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('Durdur butonuna tıklanınca timer duruyor', () => {
    jest.useFakeTimers();
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(3000); // 3 saniye ilerlet
    fireEvent.click(getByText('Stop'));
    
    expect(clearInterval).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  test('Sıfırla butonuna tıklanınca timer sıfırlanıyor', () => {
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    fireEvent.click(getByText('Reset'));
    expect(getByText('25:00')).toBeInTheDocument();
  });
});

// TimerButton Birim Testleri
describe('TimerButton Birim Testleri', () => {
  test('TimerButton komponenti render ediliyor', () => {
    const mockFunction = jest.fn();
    const { getByText } = render(<TimerButton buttonAction={mockFunction} buttonValue="Test" />); expect(getByText('Test')).toBeInTheDocument(); });

    test('TimerButton komponentine tıklanınca action tetikleniyor', () => { const mockFunction = jest.fn(); const { getByText } = render(<TimerButton buttonAction={mockFunction} buttonValue="Test" />);
    
    fireEvent.click(getByText('Test'));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    }); });