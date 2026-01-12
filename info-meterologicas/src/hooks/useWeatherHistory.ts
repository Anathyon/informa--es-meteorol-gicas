import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar o histórico de busca de cidades.
 * Persiste os dados no localStorage.
 */
export const useWeatherHistory = () => {
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);

    // Carrega histórico do localStorage na montagem
    useEffect(() => {
        const savedHistory = localStorage.getItem('weatherSearchHistory');
        if (savedHistory) {
            try {
                setSearchHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Erro ao analisar histórico salvo:", e);
            }
        }
    }, []);

    // Salva histórico no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    /**
     * Adiciona uma cidade ao histórico se ela ainda não existir.
     * @param city Nome da cidade
     */
    const addToHistory = (city: string) => {
        setSearchHistory(prev => {
            if (!prev.includes(city)) return [...prev, city];
            return prev;
        });
    };

    /**
     * Limpa todo o histórico.
     */
    const clearHistory = () => setSearchHistory([]);

    /**
     * Remove uma cidade específica do histórico.
     */
    const removeCityFromHistory = (cityToRemove: string) => {
        setSearchHistory(prev => prev.filter(city => city !== cityToRemove));
    };

    const openHistoryModal = () => setShowHistory(true);
    const closeHistoryModal = () => setShowHistory(false);

    return {
        searchHistory,
        showHistory,
        addToHistory,
        clearHistory,
        removeCityFromHistory,
        openHistoryModal,
        closeHistoryModal
    };
};
