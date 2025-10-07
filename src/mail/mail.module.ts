import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>("MAILER_HOST"),
          port: config.get<number>("MAILER_PORT"),
          secure: false,
          auth: {
            user: config.get<string>("MAILDEV_USER"),
            pass: config.get<string>("MAILDEV_PASS"),
          },
        },
        defaults: {
          from: `"Skidkachi, No Reply" <${config.get<string>("MAILDEV_USER")}>`,
        },
        template: {
          dir: join(__dirname, "/templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
