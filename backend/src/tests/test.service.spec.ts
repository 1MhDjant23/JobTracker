import { AppService } from '../app.service';

describe(',App service', () => {
  let service: AppService;
  beforeEach(() => {
    service = new AppService();
  });
  it('return the hello message', () => {
    expect(service.getHello()).toBe('Hello World!');
  });
});
