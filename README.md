# Spice Story - Authentic. Fresh. Delivered

A modern web application for ordering authentic food items online with real-time order tracking.

## Project Overview

Spice Story is a full-stack web application that allows users to browse menu items, add them to cart, and place orders with real-time tracking capabilities.

### Key Features

1. **Landing Page**
   - Display of menu items with images, descriptions, and prices
   - Responsive grid layout for menu items
   - Search and filter functionality
   - Special offers and promotions section

2. **Menu Item Details**
   - Detailed view of selected item
   - Customization options (if applicable)
   - Add to cart functionality
   - Related items suggestions

3. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Price calculation
   - Save for later option

4. **Checkout Process**
   - User authentication
   - Delivery address input
   - Payment integration
   - Order summary

5. **Order Tracking**
   - Real-time order status
   - Estimated delivery time
   - Order history
   - Order details and receipt

## Technical Stack

### Frontend
- **Framework & Language**
  - Next.js 14.0.3 (React Framework)
  - TypeScript 5.0+
  - React 18.2.0

- **State Management & Data Fetching**
  - React Context API for cart management
  - Axios for API requests

- **Styling**
  - Tailwind CSS for utility-first styling
  - CSS Modules for component-specific styles

- **Payment Processing**
  - Stripe.js for payment integration
  - @stripe/react-stripe-js for React components

- **Testing**
  - Jest for unit testing
  - React Testing Library for component testing

### Backend
- **Runtime & Framework**
  - Node.js
  - Express.js
  - TypeScript

- **Database**
  - MongoDB with Mongoose ODM
  - MongoDB Atlas for cloud hosting

- **Authentication & Security**
  - JWT (JSON Web Tokens) for authentication
  - bcrypt for password hashing
  - Express middleware for security

- **API Architecture**
  - RESTful API design
  - Express Router for route management
  - Middleware for request processing

- **Testing**
  - Jest for unit and integration testing
  - Supertest for API testing

### Development Tools
- **Version Control**
  - Git for source control
  - GitHub for repository hosting

- **Code Quality**
  - ESLint for code linting
  - Prettier for code formatting
  - TypeScript for type checking

- **Package Management**
  - npm for package management
  - package.json for dependency management

- **Environment Management**
  - dotenv for environment variables
  - cross-env for cross-platform environment variables

### Project Structure

```
spice-story/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Next.js pages
│   │   ├── context/       # React Context providers
│   │   ├── styles/        # Global styles and Tailwind config
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── tests/             # Frontend tests
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utility functions
│   └── tests/             # Backend tests
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn
- Git

### Installation Steps
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/spice-story.git
   cd spice-story
   ```

2. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd ../backend
   npm install
   ```

4. Set up environment variables
   - Create `.env` files in both frontend and backend directories
   - Add necessary environment variables (see `.env.example` files)

5. Start development servers
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm run dev
   ```

## Development Guidelines

### Code Style
- Follow ESLint and Prettier configurations
- Use TypeScript for type safety
- Write meaningful commit messages
- Document complex logic with comments

### Testing
- Write unit tests for components
- Integration tests for API endpoints
- End-to-end tests for critical user flows

### Performance
- Implement lazy loading for images
- Use code splitting
- Optimize bundle size
- Implement caching strategies

## Security Measures
- Input validation
- XSS protection
- CSRF protection
- Secure payment processing
- Data encryption
- Rate limiting

## Deployment
- CI/CD pipeline setup
- Environment configuration
- Monitoring and logging
- Backup strategies

## Future Enhancements
- User reviews and ratings
- Loyalty program
- Mobile app development
- Advanced analytics
- Multi-language support

## Contributing
Please read our contributing guidelines before submitting pull requests.

## License
This project is licensed under the MIT License.

## Contact
For any queries, please reach out to the development team. 