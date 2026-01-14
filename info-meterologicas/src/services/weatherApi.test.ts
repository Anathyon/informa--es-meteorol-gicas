
import { fetchForecastData } from './weatherApi';
// We need to mock the fetch API
global.fetch = jest.fn();

describe('weatherApi', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    describe('fetchForecastData', () => {
        it('should aggregate 3-hour forecast into daily min/max temperatures', async () => {
            const mockResponse = {
                list: [
                    // Day 1: 2023-10-10 12:00 UTC (should be day 1 everywhere mostly)
                    { dt: 1696939200, main: { temp: 20, temp_min: 18, temp_max: 22 }, weather: [{ icon: '01d' }] },
                    // Day 1: 2023-10-10 15:00 UTC
                    { dt: 1696950000, main: { temp: 25, temp_min: 24, temp_max: 26 }, weather: [{ icon: '01d' }] },

                    // Day 2: 2023-10-11 12:00 UTC
                    { dt: 1697025600, main: { temp: 22, temp_min: 20, temp_max: 23 }, weather: [{ icon: '02d' }] },
                ]
            };

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockResponse
            });

            // Note: We need to mock the environment variable locally or ensure it doesn't crash
            // In a real scenario we'd mock the env module, but for this simple test we assume constants work.

            const result = await fetchForecastData('q=SimCity');

            expect(result.hourly).toHaveLength(3); // Slices 0-5
            expect(result.daily).toBeDefined();
            expect(result.daily.length).toBeGreaterThan(0);

            // Validate Day 1 Aggregation (Both items above are same day)
            // Min should be min(18, 24) = 18
            // Max should be max(22, 26) = 26
            const day1 = result.daily[0];
            expect(day1.minTemp).toBe(18);
            expect(day1.maxTemp).toBe(26);

            // Validate Day 2
            // Min 20, Max 23
            const day2 = result.daily[1];
            expect(day2.minTemp).toBe(20);
            expect(day2.maxTemp).toBe(23);
        });
    });
});
