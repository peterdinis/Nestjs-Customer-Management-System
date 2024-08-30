import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataModule } from 'src/data/data.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  imports: [
    DataModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CustomersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
