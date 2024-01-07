// Timer.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from '@testing-library/react';
import Timer from '../components/Timer/Timer';
import { waitFor } from '@testing-library/react';
import TimerButton from '../components/TimerButton/TimerButton';

// Timer komponenti için mock bir zamanlayici kullanilacak.
jest.useFakeTimers(); // Tüm testler için fake timerlari kullaniyoruz
jest.spyOn(global, 'clearInterval'); // clearInterval fonksiyonunu izlemeye aliyoruz

// Timer Birim Testleri
describe('Timer Birim Testleri', () => {
  afterEach(() => {
    jest.clearAllTimers(); // Her testten sonra zamanlayicilari temizliyoruz
  });

  

  test('Timer komponenti render ediliyor ve başlangiçta 25:00 gösteriyor', () => {
    const { getByText } = render(<Timer />);
    expect(getByText('25:00')).toBeInTheDocument();
  });

  test('Başlat butonuna tiklaninca timer başliyor', () => {
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(1000); // 1 saniye ilerlet
    expect(getByText('24:59')).toBeInTheDocument();
  });

  test('"Durdur" butonuna tiklaninca timer duruyor', () => {
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(3000); // 3 saniye zamanlayiciyi ilerlet
    fireEvent.click(getByText('Stop'));
    
    expect(global.clearInterval).toHaveBeenCalledTimes(1);
  });

  test('Sifirla butonuna tiklaninca timer sifirlaniyor', () => {
    const { getByText } = render(<Timer />);
    
    fireEvent.click(getByText('Start'));
    jest.advanceTimersByTime(5000); // Doğru kullanim// 5 saniye ilerlet
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

  test('TimerButton komponentine tiklaninca action tetikleniyor', () => {
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
  test('Start butonuna iki kez basildiğinda timer durmuyor', () => {
    const { getByText } = render(<Timer />);
    const startButton = getByText('Start');

    // İlk kez Start butonuna basarak timer'i başlat
    fireEvent.click(startButton);
    
    // Zamanin ilerlemesini taklit et
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Timer'in başladiğini ve bir saniye geçtiğini doğrula
    expect(getByText('24:59')).toBeInTheDocument();

    // Zamanlayicinin o anki değerini alma
    const initialValue = getByText('24:59').textContent;

    // İkinci kez Start butonuna bas
    fireEvent.click(startButton);

    // Bir saniye daha ilerlet
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // İkinci kez Start butonuna bastiktan sonra timer'in durmamasi gerekiyor,
    // yani zaman bir saniye ilerlemeli
    expect(getByText('24:58')).toBeInTheDocument();
    // Timer'in ilk değeriyle şimdiki değeri eşleşmiyor olmali
    expect(getByText('24:58').textContent).not.toEqual(initialValue);
  });

  test('Başlat butonuna basildiğinda Timer başlamali ve Durdur butonuna basildiğinda durmali', async () => {
    const { getByText } = render(<Timer />);
    const startButton = getByText('Start');
    const stopButton = getByText('Stop');

    // Timer'i başlat ve 1 saniye ilerlet
    fireEvent.click(startButton);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(getByText('24:59')).toBeInTheDocument();
    });
    // 1 saniye sonra Timer'in değeri değişmeli
    expect(getByText('24:59')).toBeInTheDocument();

    // Timer'i durdur
    fireEvent.click(stopButton);
    const lastTimeValue = getByText('24:59').textContent;

    // 1 saniye daha ilerlet
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Timer durduktan sonra değerinin değişmemesi gerekiyor
    expect(getByText(lastTimeValue)).toBeInTheDocument();
  });

  test('Sifirla butonuna basildiğinda Timer sifirlanmali', () => {
    const { getByText } = render(<Timer />);
    const startButton = getByText('Start'); const resetButton = getByText('Reset');

    // Timer'i başlat ve 1 saniye ilerlet
    fireEvent.click(startButton);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Sifirla butonuna bas
    fireEvent.click(resetButton);
    
    // Sifirla butonuna basildiktan sonra Timer'in ilk değerine dönmesi beklenir
    expect(getByText('25:00')).toBeInTheDocument();
    }); 
  });