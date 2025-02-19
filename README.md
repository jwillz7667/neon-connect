# NeonMeet.com

A modern platform for connecting verified companions and event partners, built with React, TypeScript, and Supabase.

## Features

- 🔐 Secure user authentication and verification
- 👤 Comprehensive user profiles
- 🔍 Advanced search and filtering
- 💬 Real-time messaging (coming soon)
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS and Shadcn UI
- 🔒 Privacy-focused design
- ⚡ High-performance architecture

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn UI
  - Vite
  - React Router
  - React Query

- **Backend:**
  - Supabase
  - PostgreSQL
  - Face-api.js for verification

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/neonmeet.git
   cd neonmeet
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Face Detection Models Setup

1. Download the required models:
   ```bash
   # Run the model download script
   ./scripts/download-models.sh
   ```

2. The models will be placed in the `public/models` directory.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API and service integrations
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── types/         # TypeScript type definitions
└── styles/        # Global styles
```

## Development

### Code Style

- Follow the TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Use proper TypeScript types

### Testing

```bash
# Run tests
npm run test
# or
yarn test
```

### Building for Production

```bash
# Create production build
npm run build
# or
yarn build
```

## Security Features

- Secure user authentication via Supabase
- Face detection for user verification
- Rate limiting on API endpoints
- Input sanitization
- CSRF protection
- Secure file uploads

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying, modification, distribution, or use is strictly prohibited.

## Contact

For support or inquiries, please contact:
- Email: support@neonmeet.com
- Website: https://neonmeet.com