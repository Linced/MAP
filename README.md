# Market Assistant Platform

A comprehensive trading and market analysis platform built with Next.js, TypeScript, and Supabase.

## Features

- **Real-time Market Data**: Stream live market data for stocks, forex, and cryptocurrencies
- **Technical Analysis**: Advanced charting with multiple indicators and drawing tools
- **AI-Powered Insights**: Get intelligent trade ideas and market analysis
- **Portfolio Management**: Track and analyze your investments in one place
- **Custom Alerts**: Set up price and technical indicator alerts
- **Backtesting**: Test your trading strategies with historical data

## Tech Stack

- **Frontend**: Next.js 14+, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand, React Query
- **Backend**: Node.js, Express, Supabase
- **Database**: PostgreSQL
- **Authentication**: JWT, OAuth
- **Deployment**: Vercel, Docker

## Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+
- PostgreSQL 14+
- Redis 6+

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/market-assistant-platform.git
   cd market-assistant-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the values in `.env.local` with your configuration.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
market-assistant-platform/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # API services
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── database/            # Database schemas and migrations
│   └── utils/               # Shared utilities
└── services/                # Backend services
    ├── market-data/         # Market data providers
    ├── analysis/            # Technical analysis
    └── ai-assistant/        # AI integration
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run commit` - Interactive commit using Commitizen

## Environment Variables

Copy `.env.example` to `.env.local` and update the values:

- `NODE_ENV` - Application environment (development, production)
- `PORT` - Port to run the server on
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `CORS_ORIGIN` - Allowed CORS origins
- `ALPHA_VANTAGE_API_KEY` - API key for Alpha Vantage
- `POLYGON_IO_API_KEY` - API key for Polygon.io
- `OPENAI_API_KEY` - API key for OpenAI

## Database Setup

1. Create a new PostgreSQL database:
   ```sql
   CREATE DATABASE market_assistant;
   ```

2. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

### Vercel

1. Push your code to a GitHub repository
2. Import the repository on Vercel
3. Add your environment variables
4. Deploy!

### Docker

Build and run with Docker:
```bash
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
