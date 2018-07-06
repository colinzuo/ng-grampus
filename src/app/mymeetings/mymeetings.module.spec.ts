import { MymeetingsModule } from './mymeetings.module';

describe('MymeetingsModule', () => {
  let mymeetingsModule: MymeetingsModule;

  beforeEach(() => {
    mymeetingsModule = new MymeetingsModule();
  });

  it('should create an instance', () => {
    expect(mymeetingsModule).toBeTruthy();
  });
});
