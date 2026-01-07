# Book Entry Application

A blank Angular project template with SCSS styling.

## Technologies

- **Angular**: v21.0.4
- **Node.js**: v24.11.0
- **Package Manager**: npm v11.6.1
- **Styling**: SCSS

## Project Structure

```
book_entry/
├── src/
│   ├── app/
│   │   ├── app.ts          # Main component
│   │   ├── app.html        # Component template
│   │   ├── app.scss        # Component styles (SCSS)
│   │   ├── app.config.ts   # App configuration
│   │   ├── app.routes.ts   # Routing configuration
│   │   └── app.spec.ts     # Component tests
│   ├── styles.scss         # Global styles
│   ├── main.ts            # Application entry point
│   └── index.html         # Main HTML file
├── public/                # Static assets
├── angular.json          # Angular configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Installation

```bash
cd book_entry
npm install
```

### Development Server

Run the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

Execute the unit tests:

```bash
ng test
```

## Features

- ✅ Latest Angular version (21.0.4)
- ✅ SCSS styling integrated
- ✅ Routing enabled
- ✅ Clean, blank template ready for development
- ✅ Modern component structure
- ✅ TypeScript support

## Development Notes

- The project uses SCSS for styling. All component styles should use `.scss` files.
- Global styles are defined in `src/styles.scss`
- Component-specific styles are in `src/app/app.scss`
- The template uses Angular's standalone components approach

## Available Scripts

- `ng serve` - Start development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng lint` - Lint the code
- `ng generate component <name>` - Generate a new component

## Next Steps

1. Start building your components in the `src/app` directory
2. Add your routes in `app.routes.ts`
3. Customize the global styles in `styles.scss`
4. Add your business logic and features

---

Generated with Angular CLI version 21.0.4
