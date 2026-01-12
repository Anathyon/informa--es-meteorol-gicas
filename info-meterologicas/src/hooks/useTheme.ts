import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gerenciar o tema da aplicação (manual ou automático baseado na hora).
 */
export const useTheme = () => {
    const [theme, setTheme] = useState<string>('automatico');

    /**
     * Retorna o tema baseado na hora atual.
     */
    const getThemeByTime = (): string => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'manha';
        if (hour >= 12 && hour < 18) return 'tarde';
        return 'noite';
    };

    const setAppTheme = useCallback((newTheme: string) => {
        if (newTheme === 'automatico') {
            setTheme(getThemeByTime());
        } else {
            setTheme(newTheme);
        }
        // Salva a preferência (o valor 'automatico' ou o tema específico)
        // Isso pode precisar de ajuste se quisermos salvar QUE o usuário escolheu 'automatico'
        // vs o tema resolvido. Por enquanto, a lógica original parecia misturar os dois.
        // Vamos assumir que se o usuário escolhe automatico, o estado `theme` muda dinamicamente,
        // mas precisamos salvar a PREFERÊNCIA 'automatico'.
        // OBS: O código original salvava o tema resolvido. 
        // Vamos ajustar para salvar a preferência no localStorage separadamente se necessário,
        // mas o WeatherApp.tsx original usava `theme` para ambos.
    }, []);

    // Carrega tema salvo
    useEffect(() => {
        const savedTheme = localStorage.getItem('appTheme');
        if (savedTheme) {
            // Se salvamos 'automatico' antes, precisamos recalcular
            // Mas o código original salvava o valor resolvido (manha/tarde/noite) ou automatico? 
            // O código original fazia: if (savedTheme) setAppTheme(savedTheme)
            // Se o usuário salvou 'manha', fica 'manha'.
            if (savedTheme === 'automatico') {
                setTheme(getThemeByTime());
            } else {
                setTheme(savedTheme);
            }
        } else {
            setAppTheme('automatico');
        }
    }, [setAppTheme]);

    // Atualização automática
    useEffect(() => {
        const timer = setInterval(() => {
            const currentSavedTheme = localStorage.getItem('appTheme');
            if (currentSavedTheme === 'automatico') {
                setTheme(getThemeByTime());
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    /**
     * Wrapper para setar tema e salvar no localStorage
     */
    const handleSetTheme = (newTheme: string) => {
        localStorage.setItem('appTheme', newTheme); // Salva a preferência
        setAppTheme(newTheme);
    };

    return {
        theme,
        setTheme: handleSetTheme
    };
};
