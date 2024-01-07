// Timer.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from '@testing-library/react';
import Timer from '../components/Timer/Timer';
import { waitFor } from '@testing-library/react';
import TimerButton from '../components/TimerButton/TimerButton';

// Timer komponenti için mock bir zamanlayıcı kullanılacak.
jest.useFakeTimers(); // Tüm testler için fake timerları kullanıyoruz
jest.spyOn(global, 'clearInterval'); // clearInterval fonksiyonunu izlemeye alıyoruz

// Timer Birim Testleri
describe('Timer Birim Testleri', () => {
  afterEach(() => {
    jest.clearAllTimers(); // Her testten sonra zamanlayıcıları temizliyoruz
  });

  

  test('Timer komponenti render ediliyor ve başlangıçta 25:00 gösteriyor', () => {
    const { getByText } = render(<Timer />);
    expect(getByText('25:00')).toBeInTheDocument();
  });

  test('Başlat butonuna tıklanınca timer başlıyor', () => {
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(1000); // 1 saniye ilerlet
    expect(getByText('24:59')).toBeInTheDocument();
  });

  test('"Durdur" butonuna tıklanınca timer duruyor', () => {
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(3000); // 3 saniye zamanlayıcıyı ilerlet
    fireEvent.click(getByText('Stop'));
    
    expect(global.clearInterval).toHaveBeenCalledTimes(1);
  });

  test('Sıfırla butonuna tıklanınca timer sıfırlanıyor', () => {
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(5000); // Doğru kullanım// 5 saniye ilerlet
    fireEvent.click(getByText('Reset'));
    expect(getByText('25:00')).toBeInTheDocument();
  });
});

// TimerButton Birim Testleri
describe('TimerButton Birim Testleri', () => {
  test('TimerButton komponenti render ediliyor', () => {
    const mockFunction = jest.fn();
    const { getByText } = render(<TimerButton buttonAction={mockFunction} buttonValue="Test" />);
    expect(getByText('Test')).toBeInTheDocument();
  });

  test('TimerButton komponentine tıklanınca action tetikleniyor', () => {
    const mockFunction = jest.fn();
    const { getByText } = render(<TimerButton buttonAction={mockFunction} buttonValue="Test" />);

    fireEvent.click(getByText('Test'));
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});

// Timer ve TimerButton entegrasyon testleri
describe('Timer ve TimerButton Entegrasyon Testleri', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  test('Start butonuna iki kez basıldığında timer durmuyor', () => {
    const { getByText } = render(<Timer />);
    const startButton = getByText('Start');

    // İlk kez Start butonuna basarak timer'ı başlat
    fireEvent.click(startButton);
    
    // Zamanın ilerlemesini taklit et
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Timer'ın başladığını ve bir saniye geçtiğini doğrula
    expect(getByText('24:59')).toBeInTheDocument();

    // Zamanlayıcının o anki değerini alma
    const initialValue = getByText('24:59').textContent;

    // İkinci kez Start butonuna bas
    fireEvent.click(startButton);

    // Bir saniye daha ilerlet
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // İkinci kez Start butonuna bastıktan sonra timer'ın durmaması gerekiyor,
    // yani zaman bir saniye ilerlemeli
    expect(getByText('24:58')).toBeInTheDocument();
    // Timer'ın ilk değeriyle şimdiki değeri eşleşmiyor olmalı
    expect(getByText('24:58').textContent).not.toEqual(initialValue);
  });

  test('Başlat butonuna basıldığında Timer başlamalı ve Durdur butonuna basıldığında durmalı', async () => {
    const { getByText } = render(<Timer />);
    const startButton = getByText('Start');
    const stopButton = getByText('Stop');

    // Timer'ı başlat ve 1 saniye ilerlet
    fireEvent.click(startButton);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(getByText('24:59')).toBeInTheDocument();
    });
    // 1 saniye sonra Timer'ın değeri değişmeli
    expect(getByText('24:59')).toBeInTheDocument();

    // Timer'ı durdur
    fireEvent.click(stopButton);
    const lastTimeValue = getByText('24:59').textContent;

    // 1 saniye daha ilerlet
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Timer durduktan sonra değerinin değişmemesi gerekiyor
    expect(getByText(lastTimeValue)).toBeInTheDocument();
  });

  test('Sıfırla butonuna basıldığında Timer sıfırlanmalı', () => {
    const { getByText } = render(<Timer />);
    const startButton = getByText('Start'); const resetButton = getByText('Reset');

    // Timer'ı başlat ve 1 saniye ilerlet
    fireEvent.click(startButton);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Sıfırla butonuna bas
    fireEvent.click(resetButton);
    
    // Sıfırla butonuna basıldıktan sonra Timer'ın ilk değerine dönmesi beklenir
    expect(getByText('25:00')).toBeInTheDocument();
    }); 
  });