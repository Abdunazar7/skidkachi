import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

async function start() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"],
  });

  app.setGlobalPrefix("api")
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  
  const config = new DocumentBuilder()
    .setTitle("Skidkachi Project")
    .setDescription("The Skidkachi Api dec")
    .setVersion("1.0")
    .addTag("Nest, accsess and refresh tokrns, cookies, nodeEmailer, Bot and other...")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, documentFactory);
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server start at: http://localhost:${PORT}/api`);
    console.log(`Server start at: http://localhost:${PORT}/api/docs`);
  });
}
start();

