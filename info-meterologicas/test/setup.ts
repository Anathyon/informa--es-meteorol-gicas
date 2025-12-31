import '@testing-library/jest-dom';

// Mock import.meta.env
Object.defineProperty(global, 'import', {
    value: {
        meta: {
            env: {
                VITE_OPENWEATHERMAP_API_KEY: 'test-api-key',
                VITE_UNSPLASH_API_KEY: 'test-unsplash-key'
            }
        }
    }
});
