import * as dotenv from 'dotenv';

dotenv.config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private mode = this.getValue('NODE_ENV', true);
  public isDev: boolean = this.mode === 'development';
  public isProduction: boolean = this.mode === 'production';


  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getAppName(): string {
    return this.getValue('APP_NAME', true);
  }

  public getAppVersionNo() : string {
    return this.getValue('VERSION_NO', true);
  }

  public getAppVersionString() : string {
    return this.getValue('VERSION_STRING', true);
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getJwtSecret() {
    return this.getValue('JWT_SECRET', true);
  }

  public getExpiresIn() {
    return this.getValue('EXPIRES_IN', true);
  }

  public getSaltRounds() {
    return this.getValue('SALT_ROUNDS', true);
  }

  public getMongoDbUrl() {
    return this.getValue('MONGO_DB_URL', true);
  }
}

const configService = new ConfigService(process.env)
  .ensureValues([
    'MONGO_DB_URL',
    'JWT_SECRET',
    'EXPIRES_IN',
    'SALT_ROUNDS'
  ]);

export { configService };
