import http from 'http';
import { createApp } from './app';
import { connectDB, disconnectDB } from './config/db';
import { env } from './config/env';

async function bootstrap() {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Initialize Express application
    const app = createApp();
    const server = http.createServer(app);

    // 3. Start HTTP server
    server.listen(env.PORT, () => {
      console.log(`🚀 Task Manager API server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      console.log(`📡 Healthcheck available at: http://localhost:${env.PORT}/health`);
      console.log(`📋 Tasks API available at: http://localhost:${env.PORT}/api/tasks`);
    });

    // 4. Graceful shutdown handler
    let isShuttingDown = false;

    const gracefulShutdown = async (signal: string) => {
      if (isShuttingDown) {
        console.log(`⚠️ Shutdown already in progress. Ignoring ${signal}.`);
        return;
      }
      isShuttingDown = true;
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

      server.close(async (err) => {
        if (err) {
          console.error('Error during HTTP server close:', err);
          process.exit(1);
        }

        console.log('🔒 Closed remaining HTTP connections.');
        try {
          await disconnectDB();
          console.log('✅ Graceful shutdown completed.');
          process.exit(0);
        } catch (dbErr) {
          console.error('Error during MongoDB disconnect:', dbErr);
          process.exit(1);
        }
      });

      // Force shutdown after timeout if hanging
      setTimeout(() => {
        console.error('⚠️ Forcefully shutting down after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Catch unhandled rejections and exceptions
    process.on('unhandledRejection', (reason) => {
      console.error('💥 Unhandled Rejection:', reason);
      void gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

void bootstrap();
