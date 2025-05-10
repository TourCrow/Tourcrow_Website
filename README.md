# TourCrow - Travel with Influencers

![TourCrow Logo](public/Logo.svg)

TourCrow is a modern travel platform that connects travelers with social media influencers for unique and curated travel experiences. The platform offers exclusive 3-5 day themed trips, providing an opportunity to explore destinations with your favorite influencers.

## 🌟 Features

- **Curated Trips**: Handpicked travel experiences led by influencers
- **Interactive Booking**: Seamless trip booking system
- **Real-time Availability**: Live updates on trip slots
- **Responsive Design**: Mobile-first approach for all devices
- **Dynamic Filtering**: Advanced search and filter options

## 🚀 Tech Stack

- **Frontend**: Next.js 13+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **State Management**: React Hooks
- **Animations**: Custom React components

## 📦 Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```powershell
   git clone https://github.com/your-username/Tourcrow_Website.git
   cd Tourcrow_Website
   ```

2. **Install dependencies**
   ```powershell
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```powershell
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                  # Next.js 13 app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── about/           # About page
│   ├── join-trip/       # Trip listing
│   └── trip/[id]/       # Trip details
├── components/          # React components
├── public/             # Static assets
├── types/              # TypeScript types
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## 🔧 Configuration

### Tailwind CSS
Customize the theme in `tailwind.config.ts`:
```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FEC90F',
        secondary: '#231f20',
        background: '#fffbe5',
      },
      // ... other customizations
    },
  },
}
```

### TypeScript
The project uses strict TypeScript configuration. Check `tsconfig.json` for details.

## 📚 Documentation

- [Main Documentation](./DOCUMENTATION.md)
- [API Documentation](./API.md)
- [Component Documentation](./components/README.md)

## 🧪 Testing

Run the test suite:
```powershell
npm test
# or
yarn test
```

## 🚀 Deployment

1. **Build the project**
   ```powershell
   npm run build
   # or
   yarn build
   ```

2. **Start production server**
   ```powershell
   npm start
   # or
   yarn start
   ```

## 🔑 Environment Variables

Required environment variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

- Follow the ESLint configuration
- Use Prettier for code formatting
- Follow TypeScript best practices
- Write meaningful commit messages

## 🔐 Security

- All API routes are protected with appropriate authentication
- Input validation on all forms
- XSS protection enabled
- CSRF protection implemented
- Rate limiting on API routes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👥 Team

- **Frontend Development**: [Your Name]
- **UI/UX Design**: [Designer Name]
- **Backend Development**: [Backend Dev Name]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase team for the backend infrastructure
- All contributors and supporters

## 📞 Contact

For any queries, reach out to:
- Email: collaborations.tourcrow@gmail.com
- Phone: +91 95827 48945

## 🔗 Links

- [Website](https://tourcrow.com)
- [Documentation](./DOCUMENTATION.md)
- [API Documentation](./API.md)

---

Made with ❤️ by TourCrow Team
