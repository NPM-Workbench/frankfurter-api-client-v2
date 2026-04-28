/* node modules */
import { jest } from '@jest/globals';

/* app imports */
import createMSWMockServer from '../../shared/msw-mock-server.js';
import { API_ROOT } from '../../shared/index.js';
import { getAllProviders } from '../index.js';
import {
  getAllProvidersFetchErrorHandler,
  getAllProvidersOkHandler,
  mockProviders,
} from './msw-handlers.js';

/* suite */
describe('Get All Providers', () => {
  let fetchSpy: jest.SpiedFunction<typeof global.fetch>;
  let mswServer: ReturnType<typeof createMSWMockServer>;

  /* life-cycle */
  beforeAll(() => {
    mswServer = createMSWMockServer([getAllProvidersOkHandler]);
    mswServer.listen();
  });
  afterEach(() => {
    mswServer.resetHandlers();
    fetchSpy.mockRestore();
  });
  afterAll(() => mswServer.close());

  /* 1 */
  test('returns ok response, 200 status', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const response = await getAllProviders();

    /* assert */
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/providers`);
    expect(response).toMatchObject(mockProviders);
  });

  /* 2 */
  test('throws fetch error, when there is no connectivity', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    mswServer.use(getAllProvidersFetchErrorHandler);

    /* assert */
    await expect(getAllProviders()).rejects.toThrow();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/providers`);
  });
});
